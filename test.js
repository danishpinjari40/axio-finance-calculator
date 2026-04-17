const DBD_RATE = 0.0177; // 1.77%

function round(n) {
  return Math.round(n * 100) / 100;
}

function calculate(purchasePrice, loanAmount, processingFee) {
  // Down Payment = Purchase Price - Loan Amount
  const downPaymentAmount = round(purchasePrice - loanAmount);
  const downPaymentPercent = purchasePrice > 0
    ? round((downPaymentAmount / purchasePrice) * 100)
    : 0;

  // DBD = Purchase Price × 1.77%
  const dbdIncGst = round(purchasePrice * DBD_RATE);

  // Collect from Customer = Down Payment + Processing Fee
  const collectFromCustomer = round(downPaymentAmount + processingFee);

  // Total charges deducted from loan = Fee + DBD
  const totalCharges = round(processingFee + dbdIncGst);

  // Net Disbursement = Loan Amount - Processing Fee - DBD
  const netDisbursement = round(loanAmount - processingFee - dbdIncGst);

  return {
    purchasePrice,
    loanAmount,
    downPaymentAmount,
    downPaymentPercent,
    processingFee,
    dbdIncGst,
    collectFromCustomer,
    totalCharges,
    netDisbursement,
  };
}

console.log(calculate(18499.0, 14059.24, 399.0));
console.log(calculate(14499.0, 10149.3, 199.0));
