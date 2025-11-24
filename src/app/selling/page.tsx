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
  const [otmStrikes, setOtmStrikes] = useState<{
    call1: number;
    call2: number;
    put1: number;
    put2: number;
  }>({
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-6 text-white shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">Options Trading Panel</h1>
              <p className="text-sm opacity-90">
                Bullish/Bearish Strategy Execution
              </p>
            </div>
            <div className="text-right">
              <label className="text-xs opacity-80">Spot Price</label>
              <input
                type="number"
                value={spotPrice}
                onChange={(e) =>
                  setSpotPrice(parseFloat(e.target.value) || 45000)
                }
                className="text-2xl font-bold bg-white/20 rounded-lg px-4 py-2 mt-1 w-36 text-right"
              />
            </div>
          </div>
        </div>
        {/* Strategy + Lots */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-6">Strategy</h2>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setSelectedStrategy("bullish")}
                className={`px-6 py-4 rounded-xl font-bold text-lg transition ${
                  selectedStrategy === "bullish"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-400/30 hover:bg-green-500/30 text-green-100"
                }`}
              >
                📈 Bullish
              </button>
              <button
                onClick={() => setSelectedStrategy("bearish")}
                className={`px-6 py-4 rounded-xl font-bold text-lg transition ${
                  selectedStrategy === "bearish"
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-red-400/30 hover:bg-red-500/30 text-red-100"
                }`}
              >
                📉 Bearish
              </button>
            </div>
            {selectedStrategy && (
              <button
                className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xl shadow transition"
                onClick={() => executeStrategy(selectedStrategy)}
              >
                Execute {selectedStrategy.toUpperCase()} Strategy
              </button>
            )}
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-6">Lot Size</h2>
            <input
              type="number"
              value={lots}
              onChange={(e) =>
                setLots(Math.max(2, parseInt(e.target.value) || 2))
              }
              min={2}
              step={2}
              className="bg-white/20 w-full mx-auto text-4xl rounded-xl py-4 text-center font-bold"
            />
            <div className="flex mt-4 gap-4">
              {[2, 4, 6, 10, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setLots(n)}
                  className={`flex-1 px-0 py-2 rounded-lg text-center ${lots === n ? "bg-blue-500 text-white" : "bg-white/20 text-white"}`}
                >
                  {n} lots
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Summary, Strikes, Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white/10 rounded-2xl p-6 text-white min-h-[120px]">
            <h3 className="font-bold mb-3 text-blue-200">Current Strikes</h3>
            <div className="space-y-2">
              {[
                <div key="atm">
                  ATM: <span className="font-bold">{atmStrike}</span>
                </div>,
                <div key="c">
                  OTM Calls: {otmStrikes.call1}, {otmStrikes.call2}
                </div>,
                <div key="p">
                  OTM Puts: {otmStrikes.put1}, {otmStrikes.put2}
                </div>,
              ]}
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 text-white min-h-[120px] flex flex-col justify-center">
            <h3 className="font-bold mb-2 text-green-200">Net P&L</h3>
            <div className="font-bold text-2xl">
              {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toFixed(2)}
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 text-white min-h-[120px] flex flex-col justify-center">
            <h3 className="font-bold mb-2 text-purple-200">Win Rate</h3>
            <div className="font-bold text-2xl">{winRate}%</div>
          </div>
        </div>
        {/* Confirmation Modal */}
        {showConfirmation && pendingTrade && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">
                Confirm Trade
              </h2>
              <div className="mb-4">
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
                <div className="flex justify-between mt-3">
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
                  className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold"
                  onClick={() => {
                    setShowConfirmation(false);
                    setPendingTrade(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={confirmTrade}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {/* History */}
        <div className="bg-white/10 rounded-2xl p-6 mt-10 text-white">
          <h2 className="font-bold text-xl mb-4">Trade History</h2>
          {trades.length === 0 ? (
            <div className="text-center opacity-60 py-10">No trades yet.</div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  className={`rounded-lg p-4 ${trade.strategy === "bearish" ? "bg-red-500/20" : "bg-green-500/20"}`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-bold uppercase">
                      {trade.strategy}
                    </span>
                    <span
                      className={`font-bold ${trade.netCredit > 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {trade.netCredit > 0 ? "+" : ""}₹
                      {trade.netCredit.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs opacity-80 mb-1">
                    {new Date(trade.timestamp).toLocaleString()}
                  </div>
                  <div className="text-xs space-y-1 opacity-90">
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
