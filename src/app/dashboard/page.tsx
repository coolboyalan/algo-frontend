"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  DollarSign,
  Target,
  RefreshCw,
  Users,
  Globe,
  Award,
  CandlestickChart,
  Zap,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const [adminName, setAdminName] = useState<string>("Admin");
  const [loading, setLoading] = useState(true);

  // Get admin name from cookie
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const userStr = getCookie("user");
    if (userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        setAdminName(user.name || "Admin");
      } catch (e) {
        console.error("Failed to parse user cookie");
      }
    }
    setLoading(false);
  }, []);

  // Static Dashboard Data - Trading Platform Overview
  const data = {
    totalUsers: 4,
    totalPnl: 123000,
    totalTrades: 450,
    totalWinningTrades: 271,
    activeBrokers: 7,
    avgPnlPerTrade: 273,

    pnlTrendData: [
      { date: "2025-10-26", pnl: 5000 },
      { date: "2025-10-27", pnl: 8000 },
      { date: "2025-10-28", pnl: 6500 },
      { date: "2025-10-29", pnl: 12000 },
      { date: "2025-10-30", pnl: 9000 },
      { date: "2025-10-31", pnl: 15000 },
      { date: "2025-11-01", pnl: 13000 },
      { date: "2025-11-02", pnl: 18000 },
      { date: "2025-11-03", pnl: 16000 },
      { date: "2025-11-04", pnl: 22000 },
      { date: "2025-11-05", pnl: 19000 },
      { date: "2025-11-06", pnl: 25000 },
      { date: "2025-11-07", pnl: 28000 },
      { date: "2025-11-08", pnl: 24000 },
      { date: "2025-11-09", pnl: 30000 },
      { date: "2025-11-10", pnl: 27000 },
      { date: "2025-11-11", pnl: 35000 },
      { date: "2025-11-12", pnl: 32000 },
      { date: "2025-11-13", pnl: 38000 },
      { date: "2025-11-14", pnl: 40000 },
      { date: "2025-11-15", pnl: 37000 },
      { date: "2025-11-16", pnl: 42000 },
      { date: "2025-11-17", pnl: 45000 },
      { date: "2025-11-18", pnl: 48000 },
      { date: "2025-11-19", pnl: 52000 },
      { date: "2025-11-20", pnl: 55000 },
      { date: "2025-11-21", pnl: 58000 },
      { date: "2025-11-22", pnl: 62000 },
      { date: "2025-11-23", pnl: 68000 },
      { date: "2025-11-24", pnl: 72000 },
    ],

    userPerformanceData: [
      { name: "Rahul", pnl: 45000, trades: 120 },
      { name: "Priya", pnl: -12000, trades: 85 },
      { name: "Amit", pnl: 67000, trades: 150 },
      { name: "Sneha", pnl: 23000, trades: 95 },
    ],

    brokerDistribution: [
      { name: "Zerodha", value: 2, color: "#3B82F6" },
      { name: "Upstox", value: 1, color: "#10B981" },
      { name: "Angel One", value: 1, color: "#F59E0B" },
      { name: "ICICI", value: 1, color: "#8B5CF6" },
      { name: "Kotak", value: 1, color: "#EC4899" },
      { name: "Groww", value: 1, color: "#06B6D4" },
    ],

    activities: [
      {
        type: "trade",
        message: "Rahul opened position in RELIANCE",
        time: "2 mins ago",
        status: "success",
      },
      {
        type: "alert",
        message: "Priya's stop loss triggered for HDFC",
        time: "5 mins ago",
        status: "warning",
      },
      {
        type: "profit",
        message: "Amit hit profit target for TCS",
        time: "12 mins ago",
        status: "success",
      },
      {
        type: "connection",
        message: "New Zerodha connection by Sneha",
        time: "25 mins ago",
        status: "info",
      },
      {
        type: "trade",
        message: "System executed auto-trade for INFY",
        time: "45 mins ago",
        status: "success",
      },
    ],

    lastUpdated: new Date().toISOString(),
  };

  const winLossData = [
    {
      name: "Winning Trades",
      value: data.totalWinningTrades,
      color: "#10B981",
    },
    {
      name: "Losing Trades",
      value: data.totalTrades - data.totalWinningTrades,
      color: "#EF4444",
    },
  ];

  const formatCurrency = (amount: number, currency: string = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const winRate =
    data.totalTrades > 0
      ? ((data.totalWinningTrades / data.totalTrades) * 100).toFixed(1)
      : "0";

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
    "The best investment you can make is in yourself.",
    "Risk comes from not knowing what you're doing.",
    "Fortune favors the prepared mind in trading.",
    "Discipline is the bridge between goals and accomplishment.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "trade":
        return CandlestickChart;
      case "alert":
        return AlertCircle;
      case "profit":
        return TrendingUp;
      case "connection":
        return Activity;
      default:
        return Activity;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "info":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-6">
        {/* Enhanced Header with Greeting */}
        <div className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {greeting}, {adminName}!
            </h1>
            <p className="text-sm text-gray-600 italic max-w-2xl mx-auto">
              "{randomQuote}"
            </p>
            <div className="flex items-center justify-center space-x-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center">
                <Globe size={16} className="mr-1" />
                Multi-User Platform
              </span>
              <span className="flex items-center">
                <Activity size={16} className="mr-1" />
                Real-Time Monitoring
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Platform Overview
              </h2>
              <p className="text-gray-600 mt-1">
                Monitor trading performance and system health
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  Last updated:{" "}
                  {new Date(data.lastUpdated).toLocaleTimeString("en-IN")}
                </span>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-gray-100">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Total Users */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {data.totalUsers}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Active traders on platform
              </p>
            </CardContent>
          </Card>

          {/* Overall P&L */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${data.totalPnl >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(data.totalPnl)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {data.totalPnl >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className="text-xs text-gray-500">
                  All users combined
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Trades */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Trades
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(data.totalTrades)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-500">
                  {winRate}% win rate
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Active Brokers */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Brokers
              </CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {data.activeBrokers}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Activity className="h-4 w-4 text-orange-600" />
                <span className="text-xs text-gray-500">Across all users</span>
              </div>
            </CardContent>
          </Card>

          {/* Platform Win Rate */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-pink-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Platform Win Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{winRate}%</div>
              <Progress value={parseFloat(winRate)} className="mt-3 h-1" />
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center text-gray-600 mb-2">
                  <Target size={18} className="mr-2" />
                  <h3 className="text-xs font-medium uppercase tracking-wider">
                    Win Rate
                  </h3>
                </div>
                <p className="text-lg font-bold text-green-600">{winRate}%</p>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center text-gray-600 mb-2">
                  <Award size={18} className="mr-2" />
                  <h3 className="text-xs font-medium uppercase tracking-wider">
                    Average P&L/Trade
                  </h3>
                </div>
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(data.avgPnlPerTrade)}
                </p>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center text-gray-600 mb-2">
                  <TrendingUp size={18} className="mr-2" />
                  <h3 className="text-xs font-medium uppercase tracking-wider">
                    Winning Trades
                  </h3>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {formatNumber(data.totalWinningTrades)}
                </p>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center text-gray-600 mb-2">
                  <TrendingDown size={18} className="mr-2" />
                  <h3 className="text-xs font-medium uppercase tracking-wider">
                    Losing Trades
                  </h3>
                </div>
                <p className="text-lg font-bold text-red-600">
                  {formatNumber(data.totalTrades - data.totalWinningTrades)}
                </p>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* P&L Trend Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Platform P&L Trend (Last 30 Days)</CardTitle>
              <CardDescription>
                Aggregated daily profit and loss across all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.pnlTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString("en-IN")
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="pnl"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Activity size={18} className="mr-2 text-cyan-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {data.activities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-full ${getActivityColor(activity.status)}`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Win/Loss Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Win/Loss Ratio</CardTitle>
              <CardDescription>Platform-wide trade success</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {winRate}%
                </div>
                <div className="text-sm text-gray-500">Overall Win Rate</div>
              </div>
            </CardContent>
          </Card>

          {/* User Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>User Performance Comparison</CardTitle>
              <CardDescription>P&L by user</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.userPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="pnl" fill="#10B981" name="P&L" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
