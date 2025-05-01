import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TradePlanCalculator() {
  const [entryPrice, setEntryPrice] = useState(100);
  const [capital, setCapital] = useState(1000);
  const [direction, setDirection] = useState("long");
  const [stopLossPct, setStopLossPct] = useState(2); // 新增止损百分比
  const [feePct, setFeePct] = useState(0.1); // 新增手续费百分比（单边）
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
    <div className="max-w-xl mx-auto space-y-4 p-4">
      <h2 className="text-xl font-bold">交易计划计算器</h2>
      <div className="flex flex-wrap gap-2">
        <Input
          type="number"
          value={entryPrice}
          onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
          placeholder="开仓价"
        />
        <Input
          type="number"
          value={capital}
          onChange={(e) => setCapital(parseFloat(e.target.value))}
          placeholder="本金"
        />
        <select
          className="border rounded px-2"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option value="long">做多</option>
          <option value="short">做空</option>
        </select>
        <Input
          type="number"
          step="0.1"
          value={stopLossPct}
          onChange={(e) => setStopLossPct(parseFloat(e.target.value))}
          placeholder="止损% (默认2%)"
        />
        <Input
          type="number"
          step="0.01"
          value={feePct}
          onChange={(e) => setFeePct(parseFloat(e.target.value))}
          placeholder="手续费% (默认0.1%)"
        />
        <Button onClick={calculate}>计算</Button>
      </div>

      {result && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <div>本金：{result.capital} USDT</div>
            <div>最大可亏损：{result.maxLoss} USDT</div>
            <div>建议持仓：{result.positionSize} USDT</div>
            <div>建议杠杆倍数：{result.leverage}x</div>
            <div>方向：{result.direction.toUpperCase()}</div>
            <div>开仓价格：{result.entryPrice}</div>
            <div>止损价格（{result.stopLossPct}%）：{result.stopLossPrice}</div>
            <div>手续费假设：单边 {result.feePct}%</div>
            <div>止盈目标（已含手续费）：</div>
            <ul className="list-disc list-inside">
              <li>+5% 账户收益：{result.takeProfits[0]}</li>
              <li>+10% 账户收益：{result.takeProfits[1]}</li>
              <li>+15% 账户收益：{result.takeProfits[2]}</li>
              <li>+20% 账户收益：{result.takeProfits[3]}</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}