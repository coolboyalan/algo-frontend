"use client";
import React, { useState, useEffect, useCallback } from "react";
import { IndianRupee } from "lucide-react";
import {
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  BarChart2,
  PieChart as PieIcon,
  LineChart as LineIcon,
  RefreshCw,
  StopCircle,
  Briefcase,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import DashboardLayout from "@/components/Layout/DashboardLayout";

// Utility functions
const formatCurrency = (value, currency = "INR") => {
  if (!value) return "₹0.00";
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDateForChart = (dateString) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid"
      : date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return "Invalid";
  }
};

// Dark theme colors
const darkColors = {
  primary: "#0EA5E9", // Sky blue from image
  secondary: "#22D3EE", // Cyan
  accent: "#34D399", // Emerald
  background: "from-slate-900 via-slate-800 to-slate-900",
  card: "bg-slate-800/90 border-slate-700/50",
  text: "text-slate-100",
  textMuted: "text-slate-400",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
};

// Optimized Pie Chart Active Shape
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill="#E2E8F0"
        className="font-semibold text-base"
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={my}
        textAnchor={textAnchor}
        fill="#CBD5E1"
        className="text-sm"
      >{`${value} Trades`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={my}
        dy={18}
        textAnchor={textAnchor}
        fill="#94A3B8"
        className="text-xs"
      >{`${(percent * 100).toFixed(1)}%`}</text>
    </g>
  );
};

const TradingDashboardPage = () => {
  // State management - consolidated
  const [state, setState] = useState({
    brokers: [],
    pnlTrendData: [],
    winLossData: [
      { name: "Winning Trades", value: 0, color: darkColors.success },
      { name: "Losing Trades", value: 0, color: darkColors.danger },
    ],
    overallPnl: 0,
    activeBrokersCount: 0,
    totalTradesSummary: 0,
    lastUpdated: new Date(),
    isLoading: true,
    error: null,
    activePieIndex: 0,
  });

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  // API helper
  const apiCall = async (endpoint, method = "GET", body = null) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...(body && { body: JSON.stringify(body) }),
      },
    );

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  };

  // Stop all functionality
  const stopAll = async () => {
    try {
      await apiCall("/api/broker-key/stop", "PUT", {});
      alert("Deactivated successfully");
    } catch (error) {
      console.error("Stop all error:", error);
    }
  };

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    updateState({ isLoading: true, error: null });

    try {
      const result = await apiCall("/api/dashboard");
      if (!result?.success || !result?.data) {
        throw new Error("Invalid API response");
      }

      const { data } = result;
      updateState({
        brokers: data.brokers || [],
        pnlTrendData: data.pnlTrendData || [],
        winLossData:
          data.winLossData?.length === 2
            ? data.winLossData
            : [
                { name: "Winning Trades", value: 0, color: darkColors.success },
                { name: "Losing Trades", value: 0, color: darkColors.danger },
              ],
        overallPnl: parseFloat(data.overallPnl) || 0,
        activeBrokersCount: parseInt(data.activeBrokersCount) || 0,
        totalTradesSummary: parseInt(data.totalTrades) || 0,
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
        isLoading: false,
      });
    } catch (error) {
      updateState({
        error: error.message || "Failed to load dashboard data",
        isLoading: false,
        brokers: [],
        pnlTrendData: [],
        overallPnl: 0,
        activeBrokersCount: 0,
        totalTradesSummary: 0,
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper functions
  const getBrokerStatusConfig = (status) => {
    const configs = {
      active: {
        icon: CheckCircle,
        color: "text-emerald-400",
        border: "border-emerald-500/50",
      },
      inactive: {
        icon: XCircle,
        color: "text-red-400",
        border: "border-red-500/50",
      },
      maintenance: {
        icon: AlertTriangle,
        color: "text-yellow-400",
        border: "border-yellow-500/50",
      },
      default: {
        icon: Settings,
        color: "text-slate-400",
        border: "border-slate-500/50",
      },
    };
    return configs[status] || configs.default;
  };

  const getButtonConfig = (broker) => {
    if (broker.status === "active" && broker.inactiveUrl) {
      return {
        url: broker.inactiveUrl,
        text: "Disable Account",
        className:
          "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
      };
    }
    if (broker.status === "maintenance") {
      return {
        url: null,
        text: "Under Maintenance",
        className: "bg-slate-600 cursor-not-allowed",
      };
    }
    return {
      url: broker.loginUrl,
      text: "Login to Broker",
      className:
        "bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700",
    };
  };

  // Dashboard Title Component
  const DashboardTitle = () => {
    const userName = localStorage.getItem("name") || "Trader";
    const hour = new Date().getHours();
    const greeting =
      hour >= 5 && hour < 12
        ? "Good Morning"
        : hour >= 12 && hour < 17
          ? "Good Afternoon"
          : hour >= 17 && hour < 21
            ? "Good Evening"
            : "Good Night";

    const quotes = [
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "Don't watch the clock; do what it does. Keep going.",
      "The best investment you can make is in yourself.",
      "Risk comes from not knowing what you're doing.",
      "It's not about timing the market, but time in the market.",
    ];

    return (
      <div className="flex flex-col items-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          {greeting}, {userName}!
        </h1>
        <p className="text-sm sm:text-base text-slate-300 italic text-center max-w-2xl">
          "{quotes[Math.floor(Math.random() * quotes.length)]}"
        </p>
      </div>
    );
  };

  // Loading state
  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="animate-spin text-sky-400" size={48} />
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-100">
              Loading Dashboard...
            </p>
            <p className="text-slate-400">Fetching latest trading data</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
          <AlertTriangle size={60} className="mb-6 text-red-400" />
          <p className="text-2xl font-semibold mb-3 text-slate-100">
            Oops! Something went wrong
          </p>
          <p className="text-slate-400 mb-6 max-w-md text-center">
            {state.error}
          </p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center"
          >
            <RefreshCw size={18} className="mr-2" /> Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Main stats configuration
  const mainStats = [
    {
      title: "Overall P&L",
      value: formatCurrency(state.overallPnl),
      Icon: IndianRupee,
      color: state.overallPnl >= 0 ? "text-emerald-400" : "text-red-400",
      gradient: "from-emerald-500/20 to-cyan-500/20",
    },
    {
      title: "Active Brokers/Keys",
      value: `${state.activeBrokersCount} / ${state.brokers.length}`,
      Icon: Briefcase,
      color: "text-cyan-400",
      gradient: "from-cyan-500/20 to-sky-500/20",
    },
    {
      title: "Total Trades",
      value: state.totalTradesSummary.toLocaleString("en-IN"),
      Icon: Users,
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
  ];

  const pnlByBrokerData = state.brokers.map((broker) => ({
    name: broker.name,
    pnl: broker.pnl,
    currency: broker.currency,
    fill: broker.pnl >= 0 ? darkColors.success : darkColors.danger,
  }));

  return (
    <DashboardLayout>
      <div
        className={`min-h-screen bg-gradient-to-br ${darkColors.background} ${darkColors.text} p-4 sm:p-6 lg:p-8`}
      >
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <DashboardTitle />
            <div className="flex gap-2">
              {localStorage.getItem("role") === "admin" && (
                <button
                  onClick={stopAll}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors flex items-center"
                >
                  <StopCircle size={16} className="mr-2" /> Stop All
                </button>
              )}
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700 transition-colors flex items-center"
              >
                <RefreshCw size={16} className="mr-2" /> Refresh
              </button>
            </div>
          </div>
          <p className={`text-sm ${darkColors.textMuted} flex items-center`}>
            <Clock size={14} className="mr-2" />
            Last updated: {state.lastUpdated.toLocaleString("en-IN")}
          </p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {mainStats.map((stat, index) => (
            <div
              key={index}
              className={`${darkColors.card} backdrop-blur-sm p-6 rounded-xl shadow-xl border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center text-slate-400 mb-3">
                <stat.Icon size={20} className="mr-3" />
                <h3 className="text-sm font-medium uppercase tracking-wider">
                  {stat.title}
                </h3>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Broker Status */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-5 text-slate-200">
            Broker Status
          </h2>
          {state.brokers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {state.brokers.map((broker) => {
                const statusConfig = getBrokerStatusConfig(broker.status);
                const buttonConfig = getButtonConfig(broker);

                return (
                  <div
                    key={broker.id}
                    className={`${darkColors.card} backdrop-blur-sm p-5 rounded-xl shadow-lg border-l-4 ${statusConfig.border} hover:shadow-xl transition-all duration-300 hover:scale-105`}
                  >
                    <div className="flex-grow mb-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-slate-100">
                          {broker.name}
                        </h3>
                        <statusConfig.icon
                          className={statusConfig.color}
                          size={20}
                        />
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider">
                            Status
                          </p>
                          <p
                            className={`text-sm font-medium capitalize ${statusConfig.color}`}
                          >
                            {broker.status}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider">
                            P&L ({broker.currency})
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              broker.pnl >= 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {formatCurrency(broker.pnl, broker.currency)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {buttonConfig.url ? (
                      <a
                        href={buttonConfig.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${buttonConfig.className} w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-white transition-all duration-200`}
                      >
                        {buttonConfig.text}
                      </a>
                    ) : (
                      <button
                        disabled
                        className={`${buttonConfig.className} w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-white`}
                      >
                        {buttonConfig.text}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">
              No broker data available
            </p>
          )}
        </section>

        {/* Performance Charts */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-slate-200">
            Performance Overview
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* P&L Trend Chart */}
            <div
              className={`lg:col-span-2 ${darkColors.card} backdrop-blur-sm p-6 rounded-xl shadow-lg`}
            >
              <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center">
                <LineIcon size={20} className="mr-2 text-sky-400" />
                Overall P&L Trend (Last 30 Days)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={state.pnlTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateForChart}
                    stroke="#94A3B8"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #475569",
                      borderRadius: "0.5rem",
                      color: "#E2E8F0",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pnl"
                    name="P&L"
                    stroke={darkColors.primary}
                    strokeWidth={3}
                    dot={{ r: 4, fill: darkColors.primary }}
                    activeDot={{
                      r: 6,
                      stroke: darkColors.secondary,
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Win/Loss Pie Chart */}
            <div
              className={`${darkColors.card} backdrop-blur-sm p-6 rounded-xl shadow-lg`}
            >
              <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center">
                <PieIcon size={20} className="mr-2 text-purple-400" />
                Trade Success Ratio
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    activeIndex={state.activePieIndex}
                    activeShape={renderActiveShape}
                    data={state.winLossData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    onMouseEnter={(_, index) =>
                      updateState({ activePieIndex: index })
                    }
                    paddingAngle={2}
                  >
                    {state.winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", color: "#94A3B8" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* P&L by Broker Chart */}
          <div
            className={`mt-6 ${darkColors.card} backdrop-blur-sm p-6 rounded-xl shadow-lg`}
          >
            <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center">
              <BarChart2 size={20} className="mr-2 text-cyan-400" />
              P&L by Broker
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={pnlByBrokerData} margin={{ bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                  stroke="#94A3B8"
                  height={90}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  stroke="#94A3B8"
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    formatCurrency(value, props.payload.currency),
                    "P&L",
                  ]}
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    border: "1px solid #475569",
                    borderRadius: "0.5rem",
                    color: "#E2E8F0",
                  }}
                />
                <Bar dataKey="pnl" name="P&L" radius={[4, 4, 0, 0]}>
                  {pnlByBrokerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-700/50 text-center text-sm text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} AlgoMan Inc. All rights reserved.
          </p>
          <p className="mt-1">
            This dashboard is for demonstration purposes only. Not financial
            advice.
          </p>
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default TradingDashboardPage;
