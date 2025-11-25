"use client";

import { useState, useEffect } from "react";

interface OptionContract {
  strikePrice: number;
  premium: number;
  type: "CE" | "PE";
  expiry: string;
}

interface Trade {
  id: string;
  timestamp: number;
  strategy: "bullish" | "bearish";
  lots: number;
  soldOption: OptionContract;
  boughtOptions: OptionContract[];
  totalPremiumReceived: number;
  totalPremiumPaid: number;
  netCredit: number;
}

export default function OptionsTradePanel() {
  const [spotPrice, setSpotPrice] = useState<number>(45000);
  const [lots, setLots] = useState<number>(2);
  const [selectedStrategy, setSelectedStrategy] = useState<
    "bullish" | "bearish" | null
  >(null);
  const [atmStrike, setAtmStrike] = useState<number>(45000);
  const [otmStrikes, setOtmStrikes] = useState({
    call1: 45050,
    call2: 45100,
    put1: 44950,
    put2: 44900,
  });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("optionTrades");
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const atm = Math.round(spotPrice / 50) * 50;
    setAtmStrike(atm);
    setOtmStrikes({
      call1: atm + 50,
      call2: atm + 100,
      put1: atm - 50,
      put2: atm - 100,
    });
  }, [spotPrice]);

  const calculatePremium = (strike: number, type: "CE" | "PE", isATM = false) =>
    Math.max(20, (isATM ? 150 : 80) - Math.abs(strike - spotPrice) * 0.5);

  const executeStrategy = (strategy: "bullish" | "bearish") => {
    if (lots < 2 || lots % 2 !== 0)
      return alert("Minimum 2 lots required (multiples of 2)");

    let soldOption: OptionContract,
      boughtOptions: OptionContract[],
      premiumReceived = 0,
      premiumPaid = 0;

    if (strategy === "bullish") {
      soldOption = {
        strikePrice: atmStrike,
        premium: calculatePremium(atmStrike, "PE", true),
        type: "PE",
        expiry: "Current Week",
      };
      premiumReceived = soldOption.premium * lots * 50;
      boughtOptions = [
        {
          strikePrice: otmStrikes.call1,
          premium: calculatePremium(otmStrikes.call1, "CE"),
          type: "CE",
          expiry: "Current Week",
        },
        {
          strikePrice: otmStrikes.call2,
          premium: calculatePremium(otmStrikes.call2, "CE"),
          type: "CE",
          expiry: "Current Week",
        },
      ];
      premiumPaid =
        (boughtOptions[0].premium + boughtOptions[1].premium) * lots * 50;
    } else {
      soldOption = {
        strikePrice: atmStrike,
        premium: calculatePremium(atmStrike, "CE", true),
        type: "CE",
        expiry: "Current Week",
      };
      premiumReceived = soldOption.premium * lots * 50;
      boughtOptions = [
        {
          strikePrice: otmStrikes.put1,
          premium: calculatePremium(otmStrikes.put1, "PE"),
          type: "PE",
          expiry: "Current Week",
        },
        {
          strikePrice: otmStrikes.put2,
          premium: calculatePremium(otmStrikes.put2, "PE"),
          type: "PE",
          expiry: "Current Week",
        },
      ];
      premiumPaid =
        (boughtOptions[0].premium + boughtOptions[1].premium) * lots * 50;
    }

    setPendingTrade({
      strategy,
      lots,
      soldOption,
      boughtOptions,
      totalPremiumReceived: premiumReceived,
      totalPremiumPaid: premiumPaid,
      netCredit: premiumReceived - premiumPaid,
    });
    setShowConfirmation(true);
  };

  const confirmTrade = () => {
    const trade: Trade = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...pendingTrade,
    };
    const newTrades = [trade, ...trades].slice(0, 50);
    setTrades(newTrades);
    localStorage.setItem("optionTrades", JSON.stringify(newTrades));
    setShowConfirmation(false);
    setPendingTrade(null);
    setSelectedStrategy(null);
    alert("Trade executed successfully!");
  };

  const totalPnL = trades.reduce((acc, t) => acc + t.netCredit, 0);
  const winRate = trades.length
    ? (
        (trades.filter((t) => t.netCredit > 0).length / trades.length) *
        100
      ).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="rounded-xl p-6 mb-4 bg-white border shadow">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-gray-900">
                Options Trading Panel
              </h1>
              <p className="text-sm text-gray-500">
                Bullish/Bearish Strategy Execution
              </p>
            </div>
            <div className="text-right">
              <label className="text-xs text-gray-400">Spot Price</label>
              <input
                type="number"
                value={spotPrice}
                onChange={(e) =>
                  setSpotPrice(parseFloat(e.target.value) || 45000)
                }
                className="text-xl font-bold bg-gray-50 border rounded px-3 py-2 mt-1 w-32 text-right focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>
        {/* Strategy + Lots */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl p-6 bg-white border shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Strategy
            </h2>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setSelectedStrategy("bullish")}
                className={`px-6 py-3 rounded font-semibold transition border ${
                  selectedStrategy === "bullish"
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "bg-gray-100 border-gray-200 text-gray-500 hover:border-green-400"
                }`}
              >
                📈 Bullish
              </button>
              <button
                onClick={() => setSelectedStrategy("bearish")}
                className={`px-6 py-3 rounded font-semibold transition border ${
                  selectedStrategy === "bearish"
                    ? "bg-red-50 border-red-500 text-red-700"
                    : "bg-gray-100 border-gray-200 text-gray-500 hover:border-red-400"
                }`}
              >
                📉 Bearish
              </button>
            </div>
            {selectedStrategy && (
              <button
                className="w-full mt-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition"
                onClick={() => executeStrategy(selectedStrategy)}
              >
                Execute {selectedStrategy.toUpperCase()} Strategy
              </button>
            )}
          </div>
          <div className="rounded-xl p-6 bg-white border shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Lot Size
            </h2>
            <input
              type="number"
              value={lots}
              onChange={(e) =>
                setLots(Math.max(2, parseInt(e.target.value) || 2))
              }
              min={2}
              step={2}
              className="bg-gray-100 w-full text-3xl rounded py-3 text-center font-semibold border focus:outline-none focus:border-blue-400"
            />
            <div className="flex mt-4 gap-4">
              {[2, 4, 6, 10, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setLots(n)}
                  className={`flex-1 py-2 rounded ${lots === n ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}
                >
                  {n} lots
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Summary, Strikes, Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl p-6 bg-white border shadow">
            <h3 className="font-semibold mb-2 text-gray-700">
              Current Strikes
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                ATM: <span className="font-medium">{atmStrike}</span>
              </div>
              <div>
                OTM Calls: {otmStrikes.call1}, {otmStrikes.call2}
              </div>
              <div>
                OTM Puts: {otmStrikes.put1}, {otmStrikes.put2}
              </div>
            </div>
          </div>
          <div className="rounded-xl p-6 bg-white border shadow flex flex-col justify-center">
            <h3 className="font-semibold mb-2 text-gray-700">Net P&L</h3>
            <div
              className={`font-bold text-2xl ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toFixed(2)}
            </div>
          </div>
          <div className="rounded-xl p-6 bg-white border shadow flex flex-col justify-center">
            <h3 className="font-semibold mb-2 text-gray-700">Win Rate</h3>
            <div className="font-bold text-2xl">{winRate}%</div>
          </div>
        </div>
        {/* Confirmation Modal */}
        {showConfirmation && pendingTrade && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Confirm Trade
              </h2>
              <div className="mb-4 text-gray-600">
                <p className="mb-2">
                  <strong>Sell:</strong> {pendingTrade.soldOption.strikePrice}{" "}
                  {pendingTrade.soldOption.type} × {pendingTrade.lots} lots @ ₹
                  {pendingTrade.soldOption.premium}
                </p>
                {pendingTrade.boughtOptions.map(
                  (opt: OptionContract, i: number) => (
                    <p key={i}>
                      <strong>Buy:</strong> {opt.strikePrice} {opt.type} ×{" "}
                      {pendingTrade.lots} lots @ ₹{opt.premium}
                    </p>
                  ),
                )}
                <div className="flex justify-between mt-3 text-gray-700">
                  <div>
                    Credit:{" "}
                    <span className="font-bold text-green-600">
                      +₹{pendingTrade.totalPremiumReceived.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    Debit:{" "}
                    <span className="font-bold text-red-600">
                      -₹{pendingTrade.totalPremiumPaid.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    Net:{" "}
                    <span
                      className={`font-bold ${pendingTrade.netCredit >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {pendingTrade.netCredit >= 0 ? "+" : ""}₹
                      {pendingTrade.netCredit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  className="flex-1 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
                  onClick={() => {
                    setShowConfirmation(false);
                    setPendingTrade(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2 rounded bg-gray-900 hover:bg-gray-800 text-white font-semibold"
                  onClick={confirmTrade}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {/* History */}
        <div className="rounded-xl p-6 mt-10 bg-white border shadow">
          <h2 className="font-semibold text-lg mb-4 text-gray-900">
            Trade History
          </h2>
          {trades.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No trades yet.</div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  className={`rounded p-4 border ${trade.strategy === "bearish" ? "border-red-200" : "border-green-200"} bg-gray-50`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-700 uppercase">
                      {trade.strategy}
                    </span>
                    <span
                      className={`font-bold ${trade.netCredit > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {trade.netCredit > 0 ? "+" : ""}₹
                      {trade.netCredit.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {new Date(trade.timestamp).toLocaleString()}
                  </div>
                  <div className="text-xs space-y-1 text-gray-600">
                    <div>
                      Sold: {trade.soldOption.strikePrice}{" "}
                      {trade.soldOption.type} @ ₹{trade.soldOption.premium}
                    </div>
                    {trade.boughtOptions.map((opt, i) => (
                      <div key={i}>
                        Bought: {opt.strikePrice} {opt.type} @ ₹{opt.premium}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
