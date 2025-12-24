import { fetchTableData, TableParams } from "@/app/actions/table-data";
import { AssetTable, AssetItem } from "./asset-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AssetPage() {
  const initialData = await fetchTableData<AssetItem>("/api/asset", {
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  async function fetchAssetData(params: TableParams) {
    "use server";
    return fetchTableData<AssetItem>("/api/asset", params);
  }

  const totalItems =
    initialData.pagination.totalCount || initialData.data.length;

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        <div className="pt-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Asset Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage and view assets</p>
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <span className="text-lg font-bold">{totalItems}</span>
          </CardHeader>
          <CardContent>Summary of all assets managed</CardContent>
        </Card>

        <AssetTable initialData={initialData} fetchData={fetchAssetData} />
      </div>
    </div>
  );
}
