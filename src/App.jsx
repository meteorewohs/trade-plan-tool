import { useState } from 'react'

function App() {
  const [entryPrice, setEntryPrice] = useState(100)
  const [capital, setCapital] = useState(1000)
  const [direction, setDirection] = useState('long')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const maxLossPct = 0.03
    const stopLossPct = 0.02
    const maxLoss = capital * maxLossPct
    const positionSize = maxLoss / stopLossPct
    const leverage = positionSize / capital
    const stopLossPrice =
      direction === 'long'
        ? entryPrice * (1 - stopLossPct)
        : entryPrice * (1 + stopLossPct)
    const priceChangeFactors = [0.005, 0.01, 0.015, 0.02]
    const takeProfits = priceChangeFactors.map((factor) =>
      direction === 'long'
        ? (entryPrice * (1 + factor)).toFixed(2)
        : (entryPrice * (1 - factor)).toFixed(2)
    )

    setResult({
      capital,
      maxLoss: maxLoss.toFixed(2),
      positionSize: positionSize.toFixed(2),
      leverage: leverage.toFixed(2),
      direction,
      entryPrice: entryPrice.toFixed(2),
      stopLossPrice: stopLossPrice.toFixed(2),
      takeProfits
    })
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2>交易计划计算器</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="number"
          value={entryPrice}
          onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
          placeholder="开仓价"
        />
        <input
          type="number"
          value={capital}
          onChange={(e) => setCapital(parseFloat(e.target.value))}
          placeholder="本金"
        />
        <select value={direction} onChange={(e) => setDirection(e.target.value)}>
          <option value="long">做多</option>
          <option value="short">做空</option>
        </select>
        <button onClick={calculate}>计算</button>
      </div>

      {result && (
        <div style={{ background: '#f3f3f3', padding: 16, borderRadius: 8 }}>
          <p>本金: {result.capital} USDT</p>
          <p>最大可亏损: {result.maxLoss} USDT</p>
          <p>建议持仓: {result.positionSize} USDT</p>
          <p>建议杠杆倍数: {result.leverage}x</p>
          <p>方向: {result.direction.toUpperCase()}</p>
          <p>开仓价格: {result.entryPrice}</p>
          <p>止损价格: {result.stopLossPrice}</p>
          <p>止盈目标:</p>
          <ul>
            <li>+5% 账户收益: {result.takeProfits[0]}</li>
            <li>+10% 账户收益: {result.takeProfits[1]}</li>
            <li>+15% 账户收益: {result.takeProfits[2]}</li>
            <li>+20% 账户收益: {result.takeProfits[3]}</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
