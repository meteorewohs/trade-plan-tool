import { useState } from "react";

export default function TradePlanCalculator() {
  const [entryPrice, setEntryPrice] = useState(100);
  const [capital, setCapital] = useState(1000);
  const [direction, setDirection] = useState("long");
  const [stopLossPct, setStopLossPct] = useState(2);
  const [feePct, setFeePct] = useState(0.1);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const maxLossPct = 0.03;
    const stopLossDecimal = stopLossPct / 100;
    const feeDecimal = feePct / 100;

    const maxLoss = capital * maxLossPct;
    const positionSize = maxLoss / stopLossDecimal;
    const leverage = positionSize / capital;

    const stopLossPrice =
      direction === "long"
        ? entryPrice * (1 - stopLossDecimal)
        : entryPrice * (1 + stopLossDecimal);

    const priceChangeFactors = [0.005, 0.01, 0.015, 0.02];
    const takeProfits = priceChangeFactors.map((factor) => {
      const priceChange = direction === "long"
        ? entryPrice * (1 + factor)
        : entryPrice * (1 - factor);
      const adjustedPrice = direction === "long"
        ? priceChange * (1 + feeDecimal)
        : priceChange * (1 - feeDecimal);
      return adjustedPrice.toFixed(2);
    });

    setResult({
      capital,
      maxLoss: maxLoss.toFixed(2),
      positionSize: positionSize.toFixed(2),
      leverage: leverage.toFixed(2),
      direction,
      entryPrice: entryPrice.toFixed(2),
      stopLossPrice: stopLossPrice.toFixed(2),
      takeProfits,
      stopLossPct,
      feePct
    });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 24, maxWidth: 800, margin: '0 auto', background: '#f9f9f9', borderRadius: 12, boxShadow: '0 0 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 }}>💹 交易计划计算器</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 120px' }}>
          <label>开仓价：</label>
          <input type="number" value={entryPrice} onChange={(e) => setEntryPrice(parseFloat(e.target.value))} style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label>本金：</label>
          <input type="number" value={capital} onChange={(e) => setCapital(parseFloat(e.target.value))} style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label>方向：</label>
          <select value={direction} onChange={(e) => setDirection(e.target.value)} style={inputStyle}>
            <option value="long">做多</option>
            <option value="short">做空</option>
          </select>
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label>止损%：</label>
          <input type="number" step="0.1" value={stopLossPct} onChange={(e) => setStopLossPct(parseFloat(e.target.value))} style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label>手续费%：</label>
          <input type="number" step="0.01" value={feePct} onChange={(e) => setFeePct(parseFloat(e.target.value))} style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 100%' }}>
          <button onClick={calculate} style={buttonStyle}>🚀 计算</button>
        </div>
      </div>

      {result && (
        <div style={{ marginTop: 32, background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 0 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: 16 }}>📊 结果预览：</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <p>本金：<strong>{result.capital} USDT</strong></p>
            <p>最大可亏损：<strong>{result.maxLoss} USDT</strong></p>
            <p>建议持仓：<strong>{result.positionSize} USDT</strong></p>
            <p>杠杆倍数：<strong>{result.leverage}x</strong></p>
            <p>方向：<strong>{result.direction.toUpperCase()}</strong></p>
            <p>开仓价：<strong>{result.entryPrice}</strong></p>
            <p>止损价（{result.stopLossPct}%）：<strong>{result.stopLossPrice}</strong></p>
            <p>手续费假设：<strong>单边 {result.feePct}%</strong></p>
          </div>
          <div style={{ marginTop: 16 }}>
            <p><strong>🎯 止盈目标（含手续费）：</strong></p>
            <ul style={{ paddingLeft: 20 }}>
              <li>+5%：{result.takeProfits[0]}</li>
              <li>+10%：{result.takeProfits[1]}</li>
              <li>+15%：{result.takeProfits[2]}</li>
              <li>+20%：{result.takeProfits[3]}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '14px',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#0070f3',
  color: '#fff',
  cursor: 'pointer',
  width: '100%'
};
