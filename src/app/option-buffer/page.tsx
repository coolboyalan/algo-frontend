import { fetchTableData, TableParams } from "@/app/actions/table-data";
import { OptionBufferTable, OptionBufferItem } from "./optionbuffer-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export default async function OptionBufferPage() {
  const initialData = await fetchTableData<OptionBufferItem>(
    "/api/option-buffer",
    {
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  );

  async function fetchOptionBufferData(params: TableParams) {
    "use server";
    return fetchTableData<OptionBufferItem>("/api/optionbuffer", params);
  }

  const totalItems =
    initialData.pagination.totalCount || initialData.data.length;

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            OptionBuffer Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage option buffer record(s)
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total OptionBuffer
            </CardTitle>
            <span className="text-2xl font-bold">{totalItems}</span>
          </CardHeader>
          <CardContent>All time records</CardContent>
        </Card>

        <OptionBufferTable
          initialData={initialData}
          fetchData={fetchOptionBufferData}
        />
      </div>
    </div>
  );
}
