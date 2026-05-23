export interface IncomeInput {
  salary: {
    basic: number;
    hra: number;
    lta: number;
    da: number;
    specialAllowance: number;
    otherPerks: number;
  };
  business: {
    grossReceipts: number;
    expenses: number;
    optForPresumptive: boolean; // Sec 44AD / 44ADA
    presumptiveType: "44AD" | "44ADA" | "none";
  };
  houseProperty: {
    rentalIncome: number;
    municipalTaxes: number;
    homeLoanInterest: number; // Sec 24(b)
    propertyType: "self_occupied" | "let_out";
  };
  capitalGains: {
    stcgShortTerm: number; // e.g. Equity (15% or 20% post budget)
    ltcgLongTerm: number;  // e.g. Equity (10% or 12.5% post budget)
    stcgDebt: number;      // Slab rate
    ltcgProperty: number;  // 20% with indexation or 12.5%
  };
  otherSources: {
    savingsBankInterest: number;
    fdInterest: number;
    dividendIncome: number;
    otherMisc: number;
  };
}

export interface DeductionsInput {
  sec80C: {
    providentFund: number;
    publicProvidentFund: number;
    elss: number;
    lifeInsurance: number;
    stampDuty: number;
    tuitionFees: number;
    principalHomeLoan: number;
  };
  sec80D: {
    selfFamilyHealth: number;
    parentsHealth: number;
    parentsSenior: boolean;
    preventiveHealthCheckup: number;
  };
  sec80CCD1B: number; // NPS additional (up to 50k)
  sec80E: number;     // Education loan interest
  sec80G: {
    hundredPercentDonation: number;
    fiftyPercentDonation: number;
  };
  sec80TTA: number;   // Savings interest (up to 10k for normal, or 50k under 80TTB for seniors)
  customHRA: {
    rentPaid: number;
    metroCity: boolean;
    claimedHraExemption: number; // Computed or manually declared
  };
  otherDeductions: number;
}

export interface TdsTcsRecord {
  id: string;
  payerName: string;
  sectionCode: string; // e.g. 192A, 194J, 206C
  amount: number;
  rate: number;
  type: "TDS" | "TCS";
  date: string;
}

export interface TaxCalculationResult {
  grossTotalIncome: number;
  unclaimedExemptions: {
    standardDeduction: number;
    hraExemption: number;
    others: number;
  };
  totalDeductions: number;
  taxableIncome: number;
  slabTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  cess: number;
  surcharge: number;
  totalTaxLiability: number;
  tdsTcsCredited: number;
  finalPayableOrRefund: number; // Negative value represents refund, positive is payable
}

export interface ComparisonResult {
  oldRegime: TaxCalculationResult;
  newRegime: TaxCalculationResult;
  saveRegime: "old" | "new";
  marginSavings: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  occupation: string;
  income: IncomeInput;
  deductions: DeductionsInput;
  tdsTcs: TdsTcsRecord[];
  savedReports?: string[];
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}
