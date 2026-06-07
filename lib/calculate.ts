export type CalculationInput = {
  expectedPrice: number;
  loanBalance: number;
  registrationCost?: number;
  otherCost?: number;
};

export type CalculationResult = {
  expectedPrice: number;
  brokerageFee: number;
  registrationCost: number;
  otherCost: number;
  totalCost: number;
  loanBalance: number;
  netProceeds: number;
};

export function calculateNetProceeds(input: CalculationInput): CalculationResult {
  const expectedPrice = input.expectedPrice || 0;
  const loanBalance = input.loanBalance || 0;

  const brokerageFee =
    expectedPrice > 0 ? Math.floor((expectedPrice * 0.03 + 60000) * 1.1) : 0;

  const registrationCost = input.registrationCost ?? 50000;
  const otherCost = input.otherCost ?? 100000;

  const totalCost = brokerageFee + registrationCost + otherCost;
  const netProceeds = expectedPrice - loanBalance - totalCost;

  return {
    expectedPrice,
    brokerageFee,
    registrationCost,
    otherCost,
    totalCost,
    loanBalance,
    netProceeds,
  };
}
