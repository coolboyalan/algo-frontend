import { fetchTableData, TableParams } from "@/app/actions/table-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Briefcase,
  Clock,
  Globe,
  Activity,
} from "lucide-react";
import { cookies } from "next/headers";
import { BrokerLoginButton, RefreshButton } from "./client-components";

export const dynamic = "force-dynamic";

interface BrokerKeyItem {
  id: string;
  status: boolean;
  balance?: string;
  loginUrl?: string;
  broker?: {
    name: string;
  };
  user?: {
    name: string;
  };
}

async function getUserFromCookie() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  if (userCookie) {
    try {
      return JSON.parse(decodeURIComponent(userCookie));
    } catch {
      return null;
    }
  }
  return null;
}

export default async function UserDashboardPage() {
  const user = await getUserFromCookie();
  const userName = user?.name || "User";

  // Fetch broker keys server-side (same pattern as broker-keys page)
  const brokerKeyData = await fetchTableData<BrokerKeyItem>("/api/broker-key", {
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const brokerKeys = brokerKeyData.data || [];
  const totalCount = brokerKeyData.pagination?.totalCount || brokerKeys.length;
  const activeCount = brokerKeys.filter((bk) => bk.status).length;
  const totalBalance = brokerKeys.reduce(
    (sum, bk) => sum + (parseFloat(bk.balance || "0") || 0),
    0
  );

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
              &quot;{randomQuote}&quot;
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
                Last updated: {new Date().toLocaleTimeString("en-IN")}
              </span>
            </div>
            <RefreshButton />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Total Balance */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-gray-600">
                Total Balance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ₹{totalBalance.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>

          {/* Active Brokers */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-gray-600">
                Active Brokers
              </CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {activeCount} / {totalCount}
              </div>
            </CardContent>
          </Card>

          {/* Total Keys */}
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-gray-600">
                Total Broker Keys
              </CardTitle>
              <Briefcase className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {totalCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Broker Cards */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Your Brokers
          </h2>

          {brokerKeys.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                No broker keys found. Add a broker key to get started.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {brokerKeys.map((broker) => (
                <Card
                  key={broker.id}
                  className={`hover:shadow-lg transition-all border-l-4 ${broker.status ? "border-l-green-500" : "border-l-gray-300"
                    }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {broker.broker?.name || "Unknown Broker"}
                      </CardTitle>
                      <Badge
                        variant={broker.status ? "default" : "secondary"}
                        className={broker.status ? "bg-green-600" : ""}
                      >
                        {broker.status ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Balance
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{parseFloat(broker.balance || "0").toLocaleString("en-IN")}
                      </p>
                    </div>

                    {broker.status ? (
                      <div className="p-3 bg-green-50 rounded-lg text-center">
                        <p className="text-green-700 font-medium">
                          ✓ Broker Activated
                        </p>
                      </div>
                    ) : (
                      <BrokerLoginButton
                        brokerName={broker.broker?.name || "Broker"}
                        loginUrl={broker.loginUrl}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
