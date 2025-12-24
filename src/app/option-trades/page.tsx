import { fetchTableData, TableParams } from "@/app/actions/table-data";
import { OptionTradesTable } from "./optiontrades-table";
import type { OptionTradesItem } from "./optiontrades-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function OptionTradesPage() {
  const initialData = await fetchTableData<OptionTradesItem>(
    "/api/option-trade-log",
    {
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  );

  async function fetchOptionTradesData(params: TableParams) {
    "use server";
    return fetchTableData<OptionTradesItem>("/api/option-trade-log", params);
  }

  // Calculate stats
  const totalTrades = initialData.pagination.totalCount || 0;
  const currentPageTrades = initialData.data;

  const entryTrades = currentPageTrades.filter(
    (trade) => trade.type === "entry",
  ).length;
  const exitTrades = currentPageTrades.filter(
    (trade) => trade.type === "exit",
  ).length;

  const ceTrades = currentPageTrades.filter(
    (trade) => trade.direction === "CE",
  ).length;
  const peTrades = currentPageTrades.filter(
    (trade) => trade.direction === "PE",
  ).length;

  const totalQuantity = currentPageTrades.reduce(
    (sum, trade) => sum + (trade.quantity || 0),
    0,
  );

  const avgStrikePrice =
    currentPageTrades.length > 0
      ? currentPageTrades.reduce(
        (sum, trade) => sum + (trade.strikePrice || 0),
        0,
      ) / currentPageTrades.length
      : 0;

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Option Trade Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all option trade logs
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Trades
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {totalTrades}
              </div>
              <p className="text-xs text-muted-foreground">All time records</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Entry vs Exit
              </CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <ArrowUpCircle className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    {entryTrades}
                  </span>
                </div>
                <span className="text-muted-foreground">/</span>
                <div className="flex items-center gap-1">
                  <ArrowDownCircle className="h-4 w-4 text-red-600" />
                  <span className="text-lg font-bold text-red-600">
                    {exitTrades}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Entry / Exit trades
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Call vs Put</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    {ceTrades}
                  </span>
                </div>
                <span className="text-muted-foreground">/</span>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-lg font-bold text-red-600">
                    {peTrades}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                CE / PE options
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quantity
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">
                {totalQuantity.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg Strike: ₹
                {Math.round(avgStrikePrice).toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Call Options (CE)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {ceTrades}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalTrades > 0
                  ? ((ceTrades / currentPageTrades.length) * 100).toFixed(1)
                  : 0}
                % of current page
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                Put Options (PE)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{peTrades}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalTrades > 0
                  ? ((peTrades / currentPageTrades.length) * 100).toFixed(1)
                  : 0}
                % of current page
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                Average Strike
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                ₹{Math.round(avgStrikePrice).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {currentPageTrades.length} trades
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <OptionTradesTable
          initialData={initialData}
          fetchData={fetchOptionTradesData}
        />
      </div>
    </div>
  );
}
