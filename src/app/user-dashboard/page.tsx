"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  RefreshCw,
  Activity,
  TrendingUp,
  XCircle,
  Briefcase,
  Users,
  Target,
  Award,
  Zap,
  AlertCircle,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

interface BrokerKey {
  id: string;
  name: string;
  status: "active" | "inactive";
  pnl: number;
  loginUrl?: string;
}

export default function UserDashboardPage() {
  const [userName, setUserName] = useState<string>("User");
  const [loading, setLoading] = useState(true);
  const [stopping, setStopping] = useState<string | null>(null);

  // Get user from cookie
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
        setUserName(user.name || "User");
      } catch (e) {
        console.error("Failed to parse user cookie");
      }
    }
    setLoading(false);
  }, []);

  // Mock user data - Replace with actual API call
  const data: {
    overallPnl: number;
    activeBrokers: number;
    totalBrokers: number;
    totalTrades: number;
    winRate: number;
    avgPnl: number;
    bestBroker: string;
    marketExposure: number;
    lastUpdated: string;
    brokerKeys: BrokerKey[];
  } = {
    overallPnl: 0.0,
    activeBrokers: 0,
    totalBrokers: 3,
    totalTrades: 0,
    winRate: 0.0,
    avgPnl: 0.0,
    bestBroker: "Upstox",
    marketExposure: 0,
    lastUpdated: new Date().toISOString(),
    brokerKeys: [
      {
        id: "1",
        name: "Upstox",
        status: "inactive",
        pnl: 0.0,
        loginUrl: "https://login.upstox.com",
      },
      {
        id: "2",
        name: "Zerodha",
        status: "inactive",
        pnl: 0.0,
        loginUrl: "https://kite.zerodha.com",
      },
      {
        id: "3",
        name: "Angel One",
        status: "inactive",
        pnl: 0.0,
        loginUrl: "https://trade.angelone.in",
      },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

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

  // Check if current time is within trading hours (8:30 AM to 3:00 PM IST)
  const isTradingHours = () => {
    const now = new Date();
    const istTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const currentTime = hours * 60 + minutes;
    const startTime = 8 * 60 + 30; // 8:30 AM
    const endTime = 15 * 60; // 3:00 PM

    return currentTime >= startTime && currentTime < endTime;
  };

  const handleLoginToBroker = (broker: BrokerKey) => {
    if (!isTradingHours()) {
      toast.error("Trading is only allowed between 8:30 AM and 3:00 PM IST", {
        description: "Please try again during market hours",
      });
      return;
    }

    if (broker.loginUrl) {
      window.open(broker.loginUrl, "_blank");
      toast.success(`Opening ${broker.name} login page...`);
    }
  };

  const handleStopBroker = async (brokerId: string, brokerName: string) => {
    setStopping(brokerId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`${brokerName} stopped successfully`);
      // Refresh data here
    } catch (error) {
      toast.error(`Failed to stop ${brokerName}`);
    } finally {
      setStopping(null);
    }
  };

  const handleStopAll = async () => {
    if (data.activeBrokers === 0) {
      toast.info("No active brokers to stop");
      return;
    }

    setStopping("all");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("All brokers stopped successfully");
      // Refresh data here
    } catch (error) {
      toast.error("Failed to stop all brokers");
    } finally {
      setStopping(null);
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="pt-6 space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {greeting}, {userName}!
            </h1>
            <p className="text-sm text-gray-600 italic max-w-2xl mx-auto">
              "{randomQuote}"
            </p>
            <div className="flex items-center justify-center space-x-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center">
                <Globe size={16} className="mr-1" />
                Multi-Market Trading
              </span>
              <span className="flex items-center">
                <Activity size={16} className="mr-1" />
                Real-Time Analytics
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Clock size={16} />
                Last updated:{" "}
                {new Date(data.lastUpdated).toLocaleTimeString("en-IN")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleStopAll}
                disabled={stopping === "all" || data.activeBrokers === 0}
              >
                {stopping === "all" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Stopping...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Stop All
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-gray-100">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Trading Hours Warning */}
        {!isTradingHours() && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">
                Trading Hours Restriction
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Broker login is only available between 8:30 AM and 3:00 PM IST
              </p>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Overall P&L */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-gray-600">
                Overall P&L
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(data.overallPnl)}
              </div>
            </CardContent>
          </Card>

          {/* Active Brokers */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-gray-600">
                Active Brokers/Keys
              </CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {data.activeBrokers} / {data.totalBrokers}
              </div>
            </CardContent>
          </Card>

          {/* Total Trades */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-gray-600">
                Total Trades
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {data.totalTrades}
              </div>
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
                <p className="text-lg font-bold text-green-600">
                  {data.winRate}%
                </p>
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
                  {formatCurrency(data.avgPnl)}
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
                <p className="text-lg font-bold text-orange-600">
                  {data.bestBroker}
                </p>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center text-gray-600 mb-2">
                  <Activity size={18} className="mr-2" />
                  <h3 className="text-xs font-medium uppercase tracking-wider">
                    Market Exposure
                  </h3>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  {data.marketExposure} Markets
                </p>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Broker Status */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Broker Status
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {data.brokerKeys.map((broker) => (
              <Card
                key={broker.id}
                className="hover:shadow-lg transition-all border-l-4 border-l-gray-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {broker.name}
                    </CardTitle>
                    {broker.status === "active" && (
                      <button
                        onClick={() => handleStopBroker(broker.id, broker.name)}
                        disabled={stopping === broker.id}
                        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <Badge
                      variant={
                        broker.status === "active" ? "default" : "secondary"
                      }
                      className={
                        broker.status === "active" ? "bg-green-600" : ""
                      }
                    >
                      {broker.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      P&L (INR)
                    </p>
                    <p
                      className={`text-lg font-bold ${broker.pnl >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {formatCurrency(broker.pnl)}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleLoginToBroker(broker)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!isTradingHours()}
                  >
                    Login to Broker
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
