"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  DollarSign,
  Target,
  Zap,
  Link as LinkIcon,
  StopCircle,
  RefreshCw,
  Users,
  User,
  Eye,
  Globe,
  Award,
  CandlestickChart,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const [selectedUser, setSelectedUser] = useState<string>("all");

  // Static Dashboard Data - Admin View (All Users)
  const data = {
    users: [
      {
        id: 1,
        name: "Rahul Sharma",
        email: "rahul@example.com",
        totalPnl: 45000,
        totalTrades: 120,
        winningTrades: 78,
        activeBrokers: 2,
        brokerKeys: [
          {
            id: 1,
            name: "Zerodha",
            status: "active" as const,
            pnl: 30000,
            totalTrades: 75,
            winningTrades: 50,
            currency: "INR",
            loginUrl: "https://kite.zerodha.com",
            inactiveUrl: "/api/broker-key/stop/1",
          },
          {
            id: 2,
            name: "Upstox",
            status: "active" as const,
            pnl: 15000,
            totalTrades: 45,
            winningTrades: 28,
            currency: "INR",
            loginUrl: "https://login.upstox.com",
            inactiveUrl: "/api/broker-key/stop/2",
          },
        ],
      },
      {
        id: 2,
        name: "Priya Patel",
        email: "priya@example.com",
        totalPnl: -12000,
        totalTrades: 85,
        winningTrades: 38,
        activeBrokers: 1,
        brokerKeys: [
          {
            id: 3,
            name: "Angel One",
            status: "active" as const,
            pnl: -12000,
            totalTrades: 85,
            winningTrades: 38,
            currency: "INR",
            loginUrl: "https://trade.angelone.in",
            inactiveUrl: "/api/broker-key/stop/3",
          },
        ],
      },
      {
        id: 3,
        name: "Amit Kumar",
        email: "amit@example.com",
        totalPnl: 67000,
        totalTrades: 150,
        winningTrades: 95,
        activeBrokers: 3,
        brokerKeys: [
          {
            id: 4,
            name: "ICICI Direct",
            status: "active" as const,
            pnl: 40000,
            totalTrades: 80,
            winningTrades: 55,
            currency: "INR",
            loginUrl: "https://www.icicidirect.com",
            inactiveUrl: "/api/broker-key/stop/4",
          },
          {
            id: 5,
            name: "Kotak Securities",
            status: "active" as const,
            pnl: 20000,
            totalTrades: 50,
            winningTrades: 30,
            currency: "INR",
            loginUrl: "https://www.kotaksecurities.com",
            inactiveUrl: "/api/broker-key/stop/5",
          },
          {
            id: 6,
            name: "Groww",
            status: "active" as const,
            pnl: 7000,
            totalTrades: 20,
            winningTrades: 10,
            currency: "INR",
            loginUrl: "https://groww.in",
            inactiveUrl: "/api/broker-key/stop/6",
          },
        ],
      },
      {
        id: 4,
        name: "Sneha Singh",
        email: "sneha@example.com",
        totalPnl: 23000,
        totalTrades: 95,
        winningTrades: 60,
        activeBrokers: 1,
        brokerKeys: [
          {
            id: 7,
            name: "Zerodha",
            status: "inactive" as const,
            pnl: 23000,
            totalTrades: 95,
            winningTrades: 60,
            currency: "INR",
            loginUrl: "https://kite.zerodha.com",
            inactiveUrl: "/api/broker-key/stop/7",
          },
        ],
      },
    ],
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
    lastUpdated: new Date().toISOString(),
  };

  // Calculate aggregated stats
  const totalUsers = data.users.length;
  const totalPnl = data.users.reduce((sum, user) => sum + user.totalPnl, 0);
  const totalTrades = data.users.reduce(
    (sum, user) => sum + user.totalTrades,
    0,
  );
  const totalWinningTrades = data.users.reduce(
    (sum, user) => sum + user.winningTrades,
    0,
  );
  const totalActiveBrokers = data.users.reduce(
    (sum, user) => sum + user.activeBrokers,
    0,
  );
  const allBrokerKeys = data.users.flatMap((user) => user.brokerKeys);

  const winLossData = [
    { name: "Winning Trades", value: totalWinningTrades, color: "#10B981" },
    {
      name: "Losing Trades",
      value: totalTrades - totalWinningTrades,
      color: "#EF4444",
    },
  ];

  // User performance data for bar chart
  const userPerformanceData = data.users.map((user) => ({
    name: user.name.split(" ")[0],
    pnl: user.totalPnl,
    trades: user.totalTrades,
  }));

  // Filter data based on selected user
  const filteredBrokers =
    selectedUser === "all"
      ? allBrokerKeys
      : data.users.find((u) => u.id.toString() === selectedUser)?.brokerKeys ||
        [];

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
    totalTrades > 0
      ? ((totalWinningTrades / totalTrades) * 100).toFixed(1)
      : "0";

  const avgPnlPerTrade = totalTrades > 0 ? totalPnl / totalTrades : 0;

  // Best performing broker
  const bestBroker =
    allBrokerKeys.length > 0
      ? allBrokerKeys.reduce((best, current) =>
          current.pnl > best.pnl ? current : best,
        )
      : null;

  // Greeting logic
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

  // Recent activity
  const activities = [
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
  ];

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

  return (
    <div className="px-6 pb-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-6">
        {/* Enhanced Header with Greeting */}
        <div className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {greeting}, Admin!
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
                Monitor all users' trading performance and broker connections
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
                {totalUsers}
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
                className={`text-2xl font-bold ${totalPnl >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(totalPnl)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {totalPnl >= 0 ? (
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
                {formatNumber(totalTrades)}
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
                {totalActiveBrokers}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Activity className="h-4 w-4 text-orange-600" />
                <span className="text-xs text-gray-500">
                  {allBrokerKeys.length} total configured
                </span>
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
                    Average P&L
                  </h3>
                </div>
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(avgPnlPerTrade)}
                </p>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center text-gray-600 mb-2">
                  <Zap size={18} className="mr-2" />
                  <h3 className="text-xs font-medium uppercase tracking-wider">
                    Best Performing Broker
                  </h3>
                </div>
                <p className="text-lg font-bold text-yellow-600">
                  {bestBroker?.name || "N/A"}
                </p>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center text-gray-600 mb-2">
                  <Globe size={18} className="mr-2" />
                  <h3 className="text-xs font-medium uppercase tracking-wider">
                    Market Exposure
                  </h3>
                </div>
                <p className="text-lg font-bold text-cyan-600">
                  {totalActiveBrokers} Markets
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
                {activities.map((activity, index) => {
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
                <BarChart data={userPerformanceData}>
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

        {/* Users & Broker Keys */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users & Broker Keys</CardTitle>
                <CardDescription>
                  All users with their broker connections and performance
                </CardDescription>
              </div>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {data.users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(selectedUser === "all"
                ? data.users
                : data.users.filter((u) => u.id.toString() === selectedUser)
              ).map((user) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  {/* User Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div
                          className={`text-xl font-bold ${user.totalPnl >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatCurrency(user.totalPnl)}
                        </div>
                        <div className="text-xs text-gray-500">Total P&L</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {user.totalTrades}
                        </div>
                        <div className="text-xs text-gray-500">Trades</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          {user.activeBrokers}
                        </div>
                        <div className="text-xs text-gray-500">
                          Active Brokers
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* User's Broker Keys */}
                  <div className="space-y-3">
                    {user.brokerKeys.map((broker) => (
                      <div
                        key={broker.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                              broker.status === "active"
                                ? "bg-green-100"
                                : "bg-gray-200"
                            }`}
                          >
                            <Zap
                              className={`h-5 w-5 ${
                                broker.status === "active"
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-gray-900">
                                {broker.name}
                              </div>
                              <Badge
                                variant={
                                  broker.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {broker.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {broker.totalTrades} trades •{" "}
                              {broker.winningTrades} wins •{" "}
                              {(
                                (broker.winningTrades /
                                  Math.max(broker.totalTrades, 1)) *
                                100
                              ).toFixed(1)}
                              % win rate
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${broker.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {formatCurrency(broker.pnl, broker.currency)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {broker.pnl >= 0 ? "Profit" : "Loss"}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {broker.loginUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(broker.loginUrl, "_blank")
                                }
                                className="hover:bg-blue-50"
                              >
                                <LinkIcon className="h-4 w-4" />
                              </Button>
                            )}
                            {broker.status === "active" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-red-50"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Stop ${broker.name} for ${user.name}?`,
                                    )
                                  ) {
                                    alert(
                                      "This will be connected to API later",
                                    );
                                  }
                                }}
                              >
                                <StopCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
