import { fetchTableData, TableParams } from "@/app/actions/table-data";
import { DailyAssetTable, DailyAssetItem } from "./daily-asset-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DailyAssetPage() {
  const initialData = await fetchTableData<DailyAssetItem>("/api/daily-asset", {
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  async function fetchDailyAssetData(params: TableParams) {
    "use server";
    return fetchTableData<DailyAssetItem>("/api/daily-asset", params);
  }

  const totalItems =
    initialData.pagination.totalCount || initialData.data.length;

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        <div className="pt-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Daily Asset Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage daily asset records by day and asset
          </p>
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Daily Assets
            </CardTitle>
            <span className="text-2xl font-bold">{totalItems}</span>
          </CardHeader>
          <CardContent>All time daily asset records</CardContent>
        </Card>

        <DailyAssetTable
          initialData={initialData}
          fetchData={fetchDailyAssetData}
        />
      </div>
    </div>
  );
}
