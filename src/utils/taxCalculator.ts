import { IncomeInput, DeductionsInput, TdsTcsRecord, ComparisonResult, TaxCalculationResult } from "../types";

// Helper to compute HRA Exemption
export function calculateHraExemption(
  basic: number,
  da: number,
  hraReceived: number,
  rentPaid: number,
  isMetro: boolean
): number {
  if (hraReceived <= 0 || rentPaid <= 0) return 0;
  
  const salaryBase = basic + da;
  if (salaryBase <= 0) return 0;

  // HRA Exemption is minimum of three limits:
  // 1. Actual HRA received
  // 2. Rent paid minus 10% of salary base
  // 3. 50% of salary base (for Metro cities) or 40% (for non-Metro)
  const limit1 = hraReceived;
  const rentExcess = rentPaid - 0.1 * salaryBase;
  const limit2 = Math.max(0, rentExcess);
  const limit3 = salaryBase * (isMetro ? 0.5 : 0.4);

  return Math.min(limit1, limit2, limit3);
}

// Main Calculation function for a single regime
export function calculateTaxForRegime(
  income: IncomeInput,
  deductions: DeductionsInput,
  tdsTcs: TdsTcsRecord[],
  regime: "old" | "new"
): TaxCalculationResult {
  // 1. Calculate Gross Salaries and receipts
  const salaryBasic = income.salary.basic;
  const salaryHra = income.salary.hra;
  const salaryLta = income.salary.lta;
  const salaryDa = income.salary.da;
  const salarySpecial = income.salary.specialAllowance;
  const salaryPerks = income.salary.otherPerks;

  const totalSalaryReceived = salaryBasic + salaryHra + salaryLta + salaryDa + salarySpecial + salaryPerks;

  // Business income logic
  let netBusinessProfit = 0;
  if (income.business.optForPresumptive) {
    if (income.business.presumptiveType === "44AD") {
      // Sec 44AD presumptive rate is 6% (digital) or 8% (cash). We default to 6% of receipts.
      netBusinessProfit = income.business.grossReceipts * 0.06;
    } else if (income.business.presumptiveType === "44ADA") {
      // Sec 44ADA presumptive rate is 50% of gross receipts for specified professions.
      netBusinessProfit = income.business.grossReceipts * 0.50;
    } else {
      netBusinessProfit = Math.max(0, income.business.grossReceipts - income.business.expenses);
    }
  } else {
    netBusinessProfit = Math.max(0, income.business.grossReceipts - income.business.expenses);
  }

  // House Property income logic
  let hpIncome = 0;
  if (income.houseProperty.propertyType === "let_out") {
    // Net Annual Value = Rental Income - Municipal taxes paid
    const nav = Math.max(0, income.houseProperty.rentalIncome - income.houseProperty.municipalTaxes);
    // Standard deduction under Sec 24(a) is 30% of NAV
    const stdHP = nav * 0.3;
    // Interest on borrowed capital (home loan interest Sec 24(b)) - no limit for let out property
    hpIncome = nav - stdHP - income.houseProperty.homeLoanInterest;
  } else {
    // Sef occupied property: Rental is 0, Standard deduction is 0. Interest is capped at -2,00,000
    // Under new regime, interest on self-occupied house loan is NOT deductible
    if (regime === "old") {
      hpIncome = -Math.min(200000, income.houseProperty.homeLoanInterest);
    } else {
      hpIncome = 0; // Not allowed in new regime
    }
  }

  // Capital Gains
  // LTCG and STCG are taxed at special rates. For an overall simplified planner,
  // we add STCG and LTCG to Gross Total Income, we can distinguish the slab tax.
  // We'll compute slab-based items and add capital gains taxes at applicable flat rates.
  const capitalGainsTotal = 
    income.capitalGains.stcgShortTerm + 
    income.capitalGains.ltcgLongTerm + 
    income.capitalGains.stcgDebt + 
    income.capitalGains.ltcgProperty;

  // Other Sources
  const otherIncomeTotal = 
    income.otherSources.savingsBankInterest + 
    income.otherSources.fdInterest + 
    income.otherSources.dividendIncome + 
    income.otherSources.otherMisc;

  // Compute standard standard deduction
  let standardDeduction = 0;
  if (totalSalaryReceived > 0) {
    if (regime === "new") {
      standardDeduction = 75000; // FY 2024-25 new regime standard deduction is 75,000
    } else {
      standardDeduction = 50000; // Old regime standard deduction is 50,000
    }
    // Cannot exceed actual salary
    standardDeduction = Math.min(standardDeduction, totalSalaryReceived);
  }

  // Calculate HRA exemption (Only in Old Regime)
  let hraExemption = 0;
  if (regime === "old") {
    hraExemption = calculateHraExemption(
      salaryBasic,
      salaryDa,
      salaryHra,
      deductions.customHRA.rentPaid,
      deductions.customHRA.metroCity
    );
  }

  // Net salary after exemptions
  const taxableSalary = Math.max(0, totalSalaryReceived - standardDeduction - hraExemption);

  // Gross Total Income (GTI)
  // Let's combine Salary HP, Business, Capital Gains, and Other sources
  const grossTotalIncome = taxableSalary + netBusinessProfit + hpIncome + capitalGainsTotal + otherIncomeTotal;

  // Deductions calculations (Only allowed in Old Regime, Nil in New Regime)
  let totalDeductionsClaimed = 0;
  if (regime === "old") {
    // 80C deductions calculation (max 1.5 Lakhs)
    const sum80C =
      deductions.sec80C.providentFund +
      deductions.sec80C.publicProvidentFund +
      deductions.sec80C.elss +
      deductions.sec80C.lifeInsurance +
      deductions.sec80C.stampDuty +
      deductions.sec80C.tuitionFees +
      deductions.sec80C.principalHomeLoan;
    const allowed80C = Math.min(150000, sum80C);

    // 80D health insurance (self limit: 25k, parents limit: 25k or 50k if senior)
    const selfHealthClaim = Math.min(25000, deductions.sec80D.selfFamilyHealth + deductions.sec80D.preventiveHealthCheckup);
    // preventive health checkup max is 5000 inside overall 80D
    const preventivePaid = Math.min(5000, deductions.sec80D.preventiveHealthCheckup);
    
    const parentsLimit = deductions.sec80D.parentsSenior ? 50000 : 25000;
    const parentsHealthClaim = Math.min(parentsLimit, deductions.sec80D.parentsHealth);

    const allowed80D = selfHealthClaim + parentsHealthClaim;

    // 80CCD(1B) additional NPS contribution (max 50,000)
    const allowedCCD = Math.min(50000, deductions.sec80CCD1B);

    // 80E education loan interest (no upper limit, self-claim amount)
    const allowed80E = deductions.sec80E;

    // 80G donations (100% and 50% eligible chunks)
    const allowed80G = deductions.sec80G.hundredPercentDonation + deductions.sec80G.fiftyPercentDonation * 0.5;

    // 80TTA: Savings bank interest deduction (max 10,000 for normal individuals)
    // If user is a senior citizen (we can check if parents are senior or we have a senior profile, 
    // but in general savings up to 10,000)
    const maxTTA = 10000;
    const allowed80TTA = Math.min(maxTTA, income.otherSources.savingsBankInterest, deductions.sec80TTA || 10000);

    totalDeductionsClaimed = allowed80C + allowed80D + allowedCCD + allowed80E + allowed80G + allowed80TTA + (deductions.otherDeductions || 0);
    // Deductions can't exceed gross total income minus special rated capital gains
    const limitsCap = Math.max(0, grossTotalIncome - capitalGainsTotal);
    totalDeductionsClaimed = Math.min(totalDeductionsClaimed, limitsCap);
  }

  // Net Taxable Income
  const taxableIncome = Math.max(0, grossTotalIncome - totalDeductionsClaimed);

  // 4. Calculate Slab Taxes
  let slabTax = 0;
  
  // Separate out capital gains for flat taxes
  // Slabs apply to rest of income = Taxable Income - STCG - LTCG
  const specialRatesCG = income.capitalGains.stcgShortTerm + income.capitalGains.ltcgLongTerm + income.capitalGains.ltcgProperty;
  const slabSourcedIncome = Math.max(0, taxableIncome - specialRatesCG);

  if (regime === "new") {
    // FY 2024-25 New Regime Slabs:
    // UP TO 3,00,000: NIL
    // 3,00,001 to 7,00,000: 5% (Tax: 20k flat at 7L)
    // 7,00,001 to 10,00,000: 10% (Tax: 30k flat at 10L)
    // 10,00,001 to 12,00,000: 15% (Tax: 30k flat at 12L)
    // 12,00,001 to 15,00,000: 20% (Tax: 60k flat at 15L)
    // Above 15,00,000: 30%
    const incomeForSlab = slabSourcedIncome;
    if (incomeForSlab > 1500000) {
      slabTax += (incomeForSlab - 1500000) * 0.30 + 140000; // 0 + 20k + 30k + 30k + 60k = 140k
    } else if (incomeForSlab > 1200001) {
      slabTax += (incomeForSlab - 1200000) * 0.20 + 80000; // 0 + 20k + 30k + 30k = 80k
    } else if (incomeForSlab > 1000001) {
      slabTax += (incomeForSlab - 1000000) * 0.15 + 50000; // 0 + 20k + 30k = 50k
    } else if (incomeForSlab > 700001) {
      slabTax += (incomeForSlab - 700000) * 0.10 + 20000; // 0 + 20k = 20k
    } else if (incomeForSlab > 300001) {
      slabTax += (incomeForSlab - 300000) * 0.05;
    }
  } else {
    // Old Regime Slabs (General citizen):
    // UP TO 2,50,000: NIL
    // 2,50,001 to 5,00,000: 5%
    // 5,00,001 to 10,00,000: 20%
    // Above 10,00,000: 30%
    const incomeForSlab = slabSourcedIncome;
    if (incomeForSlab > 1000000) {
      slabTax += (incomeForSlab - 1000000) * 0.30 + 112500; // 0 + 12500 + 100000 = 112,500
    } else if (incomeForSlab > 500000) {
      slabTax += (incomeForSlab - 500000) * 0.20 + 12500;
    } else if (incomeForSlab > 250000) {
      slabTax += (incomeForSlab - 250000) * 0.05;
    }
  }

  // Add Special Rates Capital Gains Taxes:
  // Short Term Capital Gains 15% (under Section 111A)
  const stcgTax = income.capitalGains.stcgShortTerm * 0.15;
  // Long Term Capital Gains 12.5% or 10% (under Section 112A, we'll use standard 12.5% or 10% - let's set 12.5% post budget 2024)
  const ltcgTax = income.capitalGains.ltcgLongTerm * 0.125;
  // Capital Gains on Property/LTCG other 20%
  const ltcgPropertyTax = income.capitalGains.ltcgProperty * 0.20;

  slabTax += (stcgTax + ltcgTax + ltcgPropertyTax);

  // 5. Rebate under Section 87A
  let rebate87A = 0;
  if (regime === "new") {
    // In new regime, rebate is up to ₹20,000 for income up to ₹7,00,000
    // Taxable income <= 7,00,000 pays 0 tax
    if (taxableIncome <= 700000) {
      rebate87A = slabTax;
    }
    // Marginal relief under new regime: if income is slightly > 7,00,000
    // Not critical for detailed engine unless high fidelity is desired. We can add a simple marginal relief.
  } else {
    // In old regime, rebate is up to ₹12,500 for income up to ₹5,00,000
    if (taxableIncome <= 500000) {
      rebate87A = Math.min(slabTax, 12500);
    }
  }

  let taxAfterRebate = Math.max(0, slabTax - rebate87A);

  // 6. Surcharge
  let surcharge = 0;
  if (taxableIncome > 10000000) {
    surcharge = taxAfterRebate * 0.15; // > 1 Crore is 15%
  } else if (taxableIncome > 5000000) {
    surcharge = taxAfterRebate * 0.10; // > 50 Lakhs is 10%
  }

  // 7. Health and Education Cess (4%)
  const cess = (taxAfterRebate + surcharge) * 0.04;

  const totalTaxLiability = Math.round(taxAfterRebate + surcharge + cess);

  // 8. Subtract TDS / TCS Credited
  const tdsTcsCredited = tdsTcs.reduce((sum, item) => {
    // Both TDS and TCS can offset final payable, or TCS is a tax paid early
    return sum + item.amount;
  }, 0);

  const finalPayableOrRefund = Math.round(totalTaxLiability - tdsTcsCredited);

  return {
    grossTotalIncome,
    unclaimedExemptions: {
      standardDeduction,
      hraExemption,
      others: 0,
    },
    totalDeductions: totalDeductionsClaimed,
    taxableIncome,
    slabTax,
    rebate87A,
    taxAfterRebate,
    cess,
    surcharge,
    totalTaxLiability,
    tdsTcsCredited,
    finalPayableOrRefund,
  };
}

// Compare Old vs New Regime
export function compareRegimes(
  income: IncomeInput,
  deductions: DeductionsInput,
  tdsTcs: TdsTcsRecord[]
): ComparisonResult {
  const oldRegime = calculateTaxForRegime(income, deductions, tdsTcs, "old");
  const newRegime = calculateTaxForRegime(income, deductions, tdsTcs, "new");

  const oldTax = oldRegime.totalTaxLiability;
  const newTax = newRegime.totalTaxLiability;

  let saveRegime: "old" | "new" = "new";
  let marginSavings = 0;

  if (oldTax < newTax) {
    saveRegime = "old";
    marginSavings = newTax - oldTax;
  } else {
    saveRegime = "new";
    marginSavings = oldTax - newTax;
  }

  return {
    oldRegime,
    newRegime,
    saveRegime,
    marginSavings,
  };
}

// Generate Default Income Struct
export function getDefaultIncome(): IncomeInput {
  return {
    salary: {
      basic: 600000,
      hra: 240000,
      lta: 30000,
      da: 50000,
      specialAllowance: 120000,
      otherPerks: 40000,
    },
    business: {
      grossReceipts: 0,
      expenses: 0,
      optForPresumptive: false,
      presumptiveType: "none",
    },
    houseProperty: {
      rentalIncome: 0,
      municipalTaxes: 0,
      homeLoanInterest: 0,
      propertyType: "self_occupied",
    },
    capitalGains: {
      stcgShortTerm: 0,
      ltcgLongTerm: 0,
      stcgDebt: 0,
      ltcgProperty: 0,
    },
    otherSources: {
      savingsBankInterest: 12000,
      fdInterest: 24000,
      dividendIncome: 5000,
      otherMisc: 0,
    },
  };
}

// Generate Default Deductions Struct
export function getDefaultDeductions(): DeductionsInput {
  return {
    sec80C: {
      providentFund: 45000,
      publicProvidentFund: 50000,
      elss: 30000,
      lifeInsurance: 15000,
      stampDuty: 0,
      tuitionFees: 0,
      principalHomeLoan: 0,
    },
    sec80D: {
      selfFamilyHealth: 15000,
      parentsHealth: 20000,
      parentsSenior: false,
      preventiveHealthCheckup: 0,
    },
    sec80CCD1B: 0,
    sec80E: 0,
    sec80G: {
      hundredPercentDonation: 0,
      fiftyPercentDonation: 0,
    },
    sec80TTA: 10000,
    customHRA: {
      rentPaid: 180000,
      metroCity: true,
      claimedHraExemption: 0,
    },
    otherDeductions: 0,
  };
}
