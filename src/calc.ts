// Calculation engine — verified against BOTH Axio DOs
//
// DO 1: Price=14499, LoanAmt=10149.3, Fee=199, DBD=256.63 → NetDisb=9693.67
// DO 2: Price=18499, LoanAmt=14059.24, Fee=399, DBD=327.43 → NetDisb=13332.81
//
// Formula:
//   Loan Amount     = Purchase Price - Down Payment on Phone (line 10 - line 4)
//   DBD Inc. GST    = Purchase Price × 1.77%                (line 16)
//   Collect from Customer = Down Payment + Processing Fee    (line 4+6+9+12)
//   Net Disbursement = Loan Amount - Processing Fee - DBD   (line 11 - 12 - 16)

export interface DOResult {
  purchasePrice: number
  loanAmount: number
  downPaymentAmount: number
  downPaymentPercent: number
  processingFee: number
  dbdIncGst: number
  extraAmount: number
  collectFromCustomer: number
  totalCharges: number
  netDisbursement: number
  dealerRealization: number
}

const DBD_RATE = 0.0177 // 1.77% — verified in both DOs

export function getAutoProcessingFee(price: number): number {
  if (price <= 0) return 0
  if (price <= 15000) return 199
  return 399
}

/**
 * @param purchasePrice        Phone price (row 3/10 on DO)
 * @param customerDownPayment  Amount collected from customer at desk (includes processing fee)
 * @param processingFee        Processing fee chip selection
 * @param extraAmount          Any extra price difference the shop wants to charge
 */
export function calculate(
  purchasePrice: number,
  customerDownPayment: number,
  processingFee: number,
  extraAmount: number = 0,
): DOResult {
  // DBD = Purchase Price × 1.77%
  const dbdIncGst = round(purchasePrice * DBD_RATE)

  // User inputs the cash collected at desk (which normally includes DP + fee)
  // Now we ALSO add the DBD charge and any Extra Amount to it so it is passed to the customer
  const collectFromCustomer = round(customerDownPayment + dbdIncGst + extraAmount)
  
  // Real down payment on the phone is the initially typed value minus the processing fee
  const downPaymentAmount = round(customerDownPayment - processingFee)

  const downPaymentPercent = purchasePrice > 0
    ? round((downPaymentAmount / purchasePrice) * 100)
    : 0

  // Loan Amount = Purchase Price - Down Payment on Phone
  const loanAmount = round(purchasePrice - downPaymentAmount)

  // Total charges deducted from loan = Fee + DBD
  const totalCharges = round(processingFee + dbdIncGst)

  // Net Disbursement = Loan Amount - Processing Fee - DBD
  const netDisbursement = round(loanAmount - processingFee - dbdIncGst)

  // Total Realization for Dealer = Net disbursement + Collected from customer
  const dealerRealization = round(netDisbursement + collectFromCustomer)

  return {
    purchasePrice,
    loanAmount,
    downPaymentAmount,
    downPaymentPercent,
    processingFee,
    dbdIncGst,
    extraAmount,
    collectFromCustomer,
    totalCharges,
    netDisbursement,
    dealerRealization,
  }
}

function round(n: number): number {
  return Math.round(n)
}

export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0'
  const rounded = Math.round(Math.abs(amount))
  const intPart = rounded.toString()
  let formatted = ''
  const len = intPart.length
  if (len <= 3) {
    formatted = intPart
  } else {
    formatted = intPart.slice(-3)
    let remaining = intPart.slice(0, -3)
    while (remaining.length > 2) {
      formatted = remaining.slice(-2) + ',' + formatted
      remaining = remaining.slice(0, -2)
    }
    if (remaining.length > 0) formatted = remaining + ',' + formatted
  }
  const sign = amount < 0 ? '-' : ''
  return `${sign}₹${formatted}`
}
