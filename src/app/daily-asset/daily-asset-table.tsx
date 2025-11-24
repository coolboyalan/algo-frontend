"use client";

import { useState } from "react";
import { DynamicServerTable } from "@/components/table/dynamic-server-table";
import { ColumnDef } from "@tanstack/react-table";
import { TableParams, TableResponse } from "@/app/actions/table-data";
import type { FormFieldConfig } from "@/components/forms/auto-form-generator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type Asset = {
  id: string;
  name: string;
};

export type DailyAssetItem = {
  id: string;
  assetId: number;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  asset: Asset;
  createdAt: string;
};

interface DailyAssetTableProps {
  initialData: TableResponse<DailyAssetItem>;
  fetchData: (params: TableParams) => Promise<TableResponse<DailyAssetItem>>;
}

export function DailyAssetTable({
  initialData,
  fetchData,
}: DailyAssetTableProps) {
  const [selectedItems, setSelectedItems] = useState<DailyAssetItem[]>([]);

  const handleBulkDelete = (items: DailyAssetItem[]) => {
    alert(`Deleting ${items.length} daily asset record(s)`);
  };

  const columns: ColumnDef<DailyAssetItem>[] = [
    {
      accessorKey: "asset.name",
      header: "Asset Name",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.asset?.name || "-"}</span>
      ),
    },
    {
      accessorKey: "day",
      header: "Day",
      enableSorting: true,
      cell: ({ row }) => (
        <Badge variant="outline" className="uppercase">
          {row.original.day}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      enableSorting: true,
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-IN"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const formFields: FormFieldConfig[] = [
    {
      name: "assetId",
      label: "Asset",
      type: "searchable-select",
      required: true,
      searchEndpoint: "/api/asset",
      searchFields: ["name"],
      searchResultLabelKey: "name",
      searchResultValueKey: "id",
      searchLimit: 20,
      placeholder: "Search for an asset...",
    },
    {
      name: "day",
      label: "Day",
      type: "select",
      required: true,
      options: DailyAsset.WeekdaysEnumArr.map((day) => ({
        label: day,
        value: day,
      })),
    },
  ];

  return (
    <DynamicServerTable
      tableKey="dailyAsset"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      rowIdField="id"
      apiEndpoint="/api/daily-asset"
      formFields={formFields}
      showAddButton
      showEditButton
      showDeleteButton
      addButtonLabel="Add Daily Asset"
      searchable
      searchPlaceholder="Search by asset or day..."
      searchFields={["asset.name", "day"]}
      filters={[
        {
          field: "day",
          label: "Day",
          type: "multiselect",
          options: DailyAsset.WeekdaysEnumArr.map((day) => ({
            label: day,
            value: day,
          })),
        },
      ]}
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}
      exportable
      exportFileName="Daily-asset"
      exportConfig={{ csv: true, excel: true, pdf: true, print: true }}
      selectable
      onSelectionChange={setSelectedItems}
      bulkActions={[
        {
          label: "Delete Selected",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: () => handleBulkDelete(selectedItems),
          variant: "destructive",
        },
      ]}
      viewerTitle="Daily Asset Details"
      viewerSubtitle="Complete information"
      viewerFieldConfig={{
        id: { hidden: true },
        day: { label: "Day" },
        "asset.name": { label: "Asset" },
        createdAt: {
          label: "Created On",
          format: (value: string) => new Date(value).toLocaleString("en-IN"),
        },
      }}
    />
  );
}

// Helper to get weekdays enum for frontend usage
const DailyAsset = {
  WeekdaysEnumArr: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
};
