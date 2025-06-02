"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  BarChart2,
  PieChart as PieIcon,
  LineChart as LineIcon,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
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

const formatCurrency = (value, currency = "INR") => {
  if (value === undefined || value === null) return "₹0.00";
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDateForChart = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch (e) {
    return "Invalid Date";
  }
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
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
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill="#1F2937"
        className="font-semibold text-lg sm:text-base"
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
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#374151"
        className="text-xs sm:text-sm"
      >{`${value} Trades`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#6B7280"
        className="text-xs"
      >{`(Rate ${(percent * 100).toFixed(2)}%)`}</text>
    </g>
  );
};

const TradingDashboardPage = () => {
  const [brokers, setBrokers] = useState([]);
  const [pnlTrendData, setPnlTrendData] = useState([]);
  const [winLossData, setWinLossData] = useState([
    { name: "Winning Trades", value: 0, color: "#10B981" }, // Default structure
    { name: "Losing Trades", value: 0, color: "#EF4444" },
  ]);
  const [overallPnl, setOverallPnl] = useState(0);
  const [activeBrokersCount, setActiveBrokersCount] = useState(0);
  const [totalTradesSummary, setTotalTradesSummary] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePieIndex, setActivePieIndex] = useState(0);

  const onPieEnter = useCallback((_, index) => {
    setActivePieIndex(index);
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log("Dashboard: Starting data fetch...");

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""; // Ensure this is set in your .env file
      const response = await fetch(`${apiBaseUrl}/api/dashboard`, { headers }); // Using /api/dashboard as in your code

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Dashboard: API error response:", errorText);
        throw new Error(
          `Failed to fetch dashboard data: ${response.status} ${errorText || response.statusText}`,
        );
      }

      const result = await response.json();
      console.log("Dashboard: Received data:", result);

      if (
        !result ||
        typeof result !== "object" ||
        !result.success ||
        typeof result.data !== "object"
      ) {
        throw new Error(
          "Invalid API response structure. Expected { success: true, data: { ... } }.",
        );
      }

      const dashboardData = result.data;

      setBrokers(dashboardData.brokers || []);
      setPnlTrendData(dashboardData.pnlTrendData || []);
      setWinLossData(
        dashboardData.winLossData && dashboardData.winLossData.length === 2
          ? dashboardData.winLossData
          : [
              { name: "Winning Trades", value: 0, color: "#10B981" },
              { name: "Losing Trades", value: 0, color: "#EF4444" },
            ],
      );
      setOverallPnl(parseFloat(dashboardData.overallPnl) || 0);
      setActiveBrokersCount(parseInt(dashboardData.activeBrokersCount) || 0);
      setTotalTradesSummary(parseInt(dashboardData.totalTrades) || 0);
      setLastUpdated(
        dashboardData.lastUpdated
          ? new Date(dashboardData.lastUpdated)
          : new Date(),
      );

      console.log("Dashboard: Data fetch and processing complete.");
    } catch (err) {
      console.error(
        "Dashboard: Failed to fetch or process dashboard data:",
        err,
      );
      setError(
        err.message || "Failed to load dashboard data. Please try refreshing.",
      );
      // Set states to default empty/zero values on error
      setBrokers([]);
      setPnlTrendData([]);
      setWinLossData([
        { name: "Winning Trades", value: 0, color: "#10B981" },
        { name: "Losing Trades", value: 0, color: "#EF4444" },
      ]);
      setOverallPnl(0);
      setActiveBrokersCount(0);
      setTotalTradesSummary(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getBrokerStatusIcon = (status) => {
    /* ... same as before ... */ switch (status) {
      case "active":
        return <CheckCircle className="text-green-500" size={20} />;
      case "inactive":
        return <XCircle className="text-red-500" size={20} />;
      case "maintenance":
        return <AlertTriangle className="text-yellow-500" size={20} />;
      default:
        return <Settings className="text-gray-500" size={20} />;
    }
  };
  const getBrokerStatusColor = (status) => {
    /* ... same as before ... */ switch (status) {
      case "active":
        return "border-green-500";
      case "inactive":
        return "border-red-500";
      case "maintenance":
        return "border-yellow-500";
      default:
        return "border-gray-400";
    }
  };

  const pnlByBrokerData = brokers.map((broker) => ({
    name: broker.name,
    pnl: broker.pnl,
    currency: broker.currency,
    fill:
      broker.pnl >= 0 ? "rgba(16, 185, 129, 0.8)" : "rgba(239, 68, 68, 0.8)",
  }));

  if (isLoading) {
    /* ... same as before ... */ return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700 p-4">
        {" "}
        <div className="flex flex-col items-center">
          {" "}
          <RefreshCw
            className="animate-spin text-blue-600 mb-4"
            size={48}
          />{" "}
          <p className="text-xl font-semibold">Loading Dashboard...</p>{" "}
          <p className="text-gray-500">Fetching latest trading data.</p>{" "}
        </div>{" "}
      </div>
    );
  }
  if (error) {
    /* ... same as before ... */ return (
      <DashboardLayout>
        {" "}
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-red-700 p-4 text-center">
          {" "}
          <AlertTriangle size={60} className="mb-6 text-red-500" />{" "}
          <p className="text-2xl font-semibold mb-3">
            {" "}
            Oops! Something went wrong.{" "}
          </p>{" "}
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>{" "}
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-base font-medium shadow-lg"
          >
            {" "}
            <RefreshCw size={18} className="mr-2" /> Try Again{" "}
          </button>{" "}
        </div>{" "}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 text-gray-800 p-4 sm:p-6 lg:p-8 font-sans">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 pb-1 self-start sm:self-center">
              AlgoMan Dashboard
            </h1>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-white text-sm text-slate-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center shadow-md border border-gray-300"
              title="Refresh Data"
            >
              <RefreshCw size={16} className="mr-2 text-slate-600" /> Refresh
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center">
            <Clock size={14} className="mr-1.5" /> Last updated:{" "}
            {lastUpdated.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            on{" "}
            {lastUpdated.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Overall P&L",
              value: formatCurrency(overallPnl),
              Icon: DollarSign,
              color: overallPnl >= 0 ? "text-green-600" : "text-red-600",
              hoverBorder: "hover:border-blue-400",
            },
            {
              title: "Active Brokers/Keys",
              value: `${activeBrokersCount} / ${brokers.length}`,
              Icon: Briefcase,
              color: "text-teal-600",
              hoverBorder: "hover:border-teal-400",
            },
            {
              title: "Total Trades",
              value: totalTradesSummary.toLocaleString("en-IN"),
              Icon: Users,
              color: "text-purple-600",
              hoverBorder: "hover:border-purple-400",
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 ${stat.hoverBorder} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex items-center text-slate-500 mb-2">
                {" "}
                <stat.Icon size={18} className="mr-2" />{" "}
                <h3 className="text-sm font-medium uppercase tracking-wider">
                  {" "}
                  {stat.title}{" "}
                </h3>{" "}
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-5 text-slate-700">
            {" "}
            Broker Status{" "}
          </h2>
          {brokers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {brokers.map((broker) => (
                <div
                  key={broker.id}
                  className={`bg-white p-5 rounded-lg shadow-lg border-l-4 ${getBrokerStatusColor(broker.status)} transition-all duration-300 hover:shadow-md hover:shadow-blue-300/50 hover:scale-105`}
                >
                  <div className="flex justify-between items-start mb-3">
                    {" "}
                    <h3 className="text-lg font-semibold text-slate-800 leading-tight">
                      {" "}
                      {broker.name}{" "}
                    </h3>{" "}
                    {getBrokerStatusIcon(broker.status)}{" "}
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    {" "}
                    Status{" "}
                  </p>
                  <p
                    className={`text-sm font-medium capitalize ${broker.status === "active" ? "text-green-600" : broker.status === "inactive" ? "text-red-600" : broker.status === "maintenance" ? "text-yellow-600" : "text-gray-600"}`}
                  >
                    {" "}
                    {broker.status}{" "}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-3 mb-1">
                    {" "}
                    P&L ({broker.currency}){" "}
                  </p>
                  <p
                    className={`text-sm font-medium ${broker.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {" "}
                    {formatCurrency(broker.pnl, broker.currency)}{" "}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">
              {" "}
              No broker key data available.{" "}
            </p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-slate-700">
            {" "}
            Performance Overview{" "}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center">
                {" "}
                <LineIcon size={20} className="mr-2 text-blue-600" /> Overall
                P&L Trend (Last 30 Days){" "}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pnlTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateForChart}
                    stroke="#6B7280"
                    tick={{ fontSize: 10 }}
                    dy={5}
                  />
                  <YAxis
                    stroke="#6B7280"
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    tick={{ fontSize: 10 }}
                    dx={-5}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow:
                        "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
                    }}
                    labelStyle={{
                      color: "#1F2937",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                    itemStyle={{ color: "#374151" }}
                    cursor={{ fill: "rgba(229, 231, 235, 0.4)" }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                      paddingTop: "10px",
                      color: "#4B5563",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pnl"
                    name="P&L"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#2563EB", strokeWidth: 0 }}
                    activeDot={{
                      r: 7,
                      stroke: "#1D4ED8",
                      strokeWidth: 2,
                      fill: "#2563EB",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center">
                {" "}
                <PieIcon size={20} className="mr-2 text-purple-600" /> Trade
                Success Ratio{" "}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    activeIndex={activePieIndex}
                    activeShape={renderActiveShape}
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8B5CF6"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    paddingAngle={3}
                    cornerRadius={5}
                  >
                    {" "}
                    {winLossData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={entry.color}
                        strokeWidth={0.5}
                      />
                    ))}{" "}
                  </Pie>
                  <Legend
                    iconType="circle"
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      fontSize: "12px",
                      marginTop: "15px",
                      color: "#4B5563",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-6 bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center">
              {" "}
              <BarChart2 size={20} className="mr-2 text-teal-500" /> P&L by
              Broker{" "}
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={pnlByBrokerData}
                margin={{ top: 5, right: 5, left: 5, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                  stroke="#6B7280"
                  height={90}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  stroke="#6B7280"
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  tick={{ fontSize: 10 }}
                  dx={-5}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    formatCurrency(value, props.payload.currency),
                    "P&L",
                  ]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
                  }}
                  labelStyle={{
                    color: "#1F2937",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                  itemStyle={{ color: "#374151" }}
                  cursor={{ fill: "rgba(229, 231, 235, 0.4)" }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    paddingTop: "10px",
                    color: "#4B5563",
                  }}
                />
                <Bar dataKey="pnl" name="P&L" radius={[4, 4, 0, 0]}>
                  {" "}
                  {pnlByBrokerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}{" "}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-gray-300 text-center text-xs sm:text-sm text-slate-600">
          <p>
            {" "}
            &copy; {new Date().getFullYear()} AlgoMan Inc. All rights
            reserved.{" "}
          </p>
          <p className="mt-1">
            {" "}
            This dashboard is for demonstration and informational purposes only.
            Not financial advice.{" "}
          </p>
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default TradingDashboardPage;
