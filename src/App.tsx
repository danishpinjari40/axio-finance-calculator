import { useState, useCallback, useEffect } from 'react'
import { calculate, getAutoProcessingFee, formatINR, type DOResult } from './calc'

const FEES = [199, 399]

export default function App() {
  const [price, setPrice] = useState<string>('')
  const [downPayment, setDownPayment] = useState<string>('')
  const [extraAmount, setExtraAmount] = useState<string>('')
  const [fee, setFee] = useState<number>(399)
  const [autoFee, setAutoFee] = useState<boolean>(true)
  const [result, setResult] = useState<DOResult | null>(null)

  const recalculate = useCallback(() => {
    const p = parseFloat(price) || 0
    const dp = parseFloat(downPayment) || 0
    const ea = parseFloat(extraAmount) || 0
    if (p <= 0 || dp <= 0) { setResult(null); return }
    const usedFee = autoFee ? getAutoProcessingFee(p) : fee
    if (autoFee) setFee(usedFee)
    setResult(calculate(p, dp, usedFee, ea))
  }, [price, downPayment, extraAmount, fee, autoFee])

  useEffect(() => { recalculate() }, [recalculate])

  const handlePriceChange = (val: string) => {
    setPrice(val.replace(/[^0-9.]/g, ''))
    setAutoFee(true)
  }

  const handleDownPaymentChange = (val: string) => {
    setDownPayment(val.replace(/[^0-9.]/g, ''))
  }

  const handleExtraAmountChange = (val: string) => {
    setExtraAmount(val.replace(/[^0-9.]/g, ''))
  }

  const handleFeeSelect = (f: number) => {
    setFee(f)
    setAutoFee(false)
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">ax</div>
          <h1>DO Calculator</h1>
        </div>
        <p>Axio Dealer Finance • Instant Breakdown</p>
      </header>

      {/* Inputs Card */}
      <div className="glass-card animate-in">
        <div className="card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Enter Details
        </div>

        {/* Purchase Price */}
        <div className="input-group input-main">
          <div className="input-label">
            <span>Phone Purchase Price</span>
          </div>
          <div className="input-wrapper">
            <span className="input-prefix">₹</span>
            <input
              id="purchase-price"
              type="text"
              inputMode="decimal"
              placeholder="14,499"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Down Payment */}
        <div className="input-group">
          <div className="input-label">
            <span>Down Payment</span>
            <span className="label-badge">Collected</span>
          </div>
          <div className="input-wrapper">
            <span className="input-prefix">₹</span>
            <input
              id="down-payment"
              type="text"
              inputMode="decimal"
              placeholder="4,838.76"
              value={downPayment}
              onChange={(e) => handleDownPaymentChange(e.target.value)}
            />
          </div>
          <div className="input-hint">Total cash collected from customer</div>
        </div>

        {/* Extra Amount */}
        <div className="input-group">
          <div className="input-label">
            <span>Extra Price Diff</span>
            <span className="label-badge">Optional</span>
          </div>
          <div className="input-wrapper">
            <span className="input-prefix">₹</span>
            <input
              id="extra-amount"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={extraAmount}
              onChange={(e) => handleExtraAmountChange(e.target.value)}
            />
          </div>
          <div className="input-hint">Difference between system & DO (e.g. 200)</div>
        </div>

        {/* Processing Fee */}
        <div className="input-group">
          <div className="input-label">
            <span>Processing Fee (Inc. GST)</span>
            {autoFee && <span className="label-badge">Auto</span>}
          </div>
          <div className="fee-chips">
            {FEES.map((f) => (
              <button
                key={f}
                className={`fee-chip ${fee === f ? 'active' : ''}`}
                onClick={() => handleFeeSelect(f)}
              >
                ₹{f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result ? (
        <>
          {/* Hero */}
          <div className="result-hero animate-in delay-2">
            <div className="result-hero-label">Net Disbursement from Axio</div>
            <div className="result-hero-value">{formatINR(result.netDisbursement)}</div>
            <div className="result-hero-sub">Amount Axio will transfer to your bank</div>
          </div>

          {/* Breakdown */}
          <div className="glass-card animate-in delay-3">
            <div className="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m7 12 4-4 4 4 4-4"/></svg>
              Full Breakdown
            </div>

            <div className="result-row">
              <span className="result-row-label"><span className="dot green"></span>Loan Amount</span>
              <span className="result-row-value positive">{formatINR(result.loanAmount)}</span>
            </div>

            <div className="result-row">
              <span className="result-row-label"><span className="dot green"></span>Down Payment on Phone</span>
              <span className="result-row-value positive">{formatINR(result.downPaymentAmount)}
                <span className="row-pct"> {result.downPaymentPercent}%</span>
              </span>
            </div>

            <hr className="result-divider" />

            <div className="result-row">
              <span className="result-row-label"><span className="dot amber"></span>Processing Fee</span>
              <span className="result-row-value negative">-{formatINR(result.processingFee)}</span>
            </div>

            <div className="result-row">
              <span className="result-row-label"><span className="dot red"></span>DBD Inc. GST (1.77%)</span>
              <span className="result-row-value danger">-{formatINR(result.dbdIncGst)}</span>
            </div>

            <hr className="result-divider" />

            <div className="result-row">
              <span className="result-row-label"><span className="dot red"></span><strong>Total Charges</strong></span>
              <span className="result-row-value danger"><strong>-{formatINR(result.totalCharges)}</strong></span>
            </div>
          </div>

          {/* Collect from Customer */}
          <div className="summary-bar animate-in delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="summary-item full-width" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="summary-item-label">Total Collect from Customer</div>
              <div className="summary-item-value amber">{formatINR(result.collectFromCustomer)}</div>
            </div>
            <div className="breakdown-chips" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div className="fee-chip active" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                 DP: {formatINR(result.downPaymentAmount)}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.5)' }}><path d="M12 5v14M5 12h14"/></svg>
              <div className="fee-chip active" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                 Fee: {formatINR(result.processingFee)}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.5)' }}><path d="M12 5v14M5 12h14"/></svg>
              <div className="fee-chip active" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                 DBD: {formatINR(result.dbdIncGst)}
              </div>
              {result.extraAmount > 0 && (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.5)' }}><path d="M12 5v14M5 12h14"/></svg>
                  <div className="fee-chip active" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                    Extra: {formatINR(result.extraAmount)}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Total Realization */}
          <div className="summary-bar animate-in delay-4" style={{ marginTop: '1rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div className="summary-item full-width">
              <div className="summary-item-label" style={{ color: '#10b981' }}>Shop Total Sale (Total Collection)</div>
              <div className="summary-item-value" style={{ color: '#10b981' }}>{formatINR(result.dealerRealization)}</div>
              <div className="summary-item-detail">
                Collected ({formatINR(result.collectFromCustomer)}) + Net Disburse ({formatINR(result.netDisbursement)})
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state animate-in delay-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <p>Enter Purchase Price & Down Payment to calculate</p>
        </div>
      )}

      <footer className="footer">
        <p>Axio CapFloat • DBD 1.77% • 0% Interest</p>
      </footer>
    </div>
  )
}
