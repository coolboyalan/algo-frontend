import { fetchTableData, TableParams } from "@/app/actions/table-data";
import { BrokersTable } from "./brokers-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Calendar } from "lucide-react";

type Broker = {
  id: string;
  name: "Zerodha" | "Upstox" | "Angel One";
  createdAt: string;
};

export default async function BrokersPage() {
  const initialData = await fetchTableData<Broker>("/api/broker", {
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  async function fetchBrokers(params: TableParams) {
    "use server";
    return fetchTableData<Broker>("/api/brokers", params);
  }

  // Calculate stats
  const totalBrokers =
    initialData.pagination.totalCount || initialData.data.length;

  // Count per broker
  const brokerCounts = initialData.data.reduce(
    (acc, broker) => {
      acc[broker.name] = (acc[broker.name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Broker Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage trading brokers and their information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Brokers
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBrokers}</div>
              <p className="text-xs text-muted-foreground">Active brokers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zerodha</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {brokerCounts["Zerodha"] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Broker entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upstox</CardTitle>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {brokerCounts["Upstox"] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Broker entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Angel One</CardTitle>
              <Building2 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {brokerCounts["Angel One"] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Broker entries</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <BrokersTable initialData={initialData} fetchData={fetchBrokers} />
      </div>
    </div>
  );
}
