"use client";

import { useState } from "react";
import { DynamicServerTable } from "@/components/table/dynamic-server-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TableParams, TableResponse } from "@/app/actions/table-data";
import type { FormFieldConfig } from "@/components/forms/auto-form-generator";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type AssetItem = {
  id: string;
  name: "NIFTY" | "SENSEX";
  zerodhaToken?: string | number;
  upstoxToken?: string;
  angeloneToken?: string;
  createdAt: string;
};

interface AssetTableProps {
  initialData: TableResponse<AssetItem>;
  fetchData: (params: TableParams) => Promise<TableResponse<AssetItem>>;
}

export function AssetTable({ initialData, fetchData }: AssetTableProps) {
  const [selectedItems, setSelectedItems] = useState<AssetItem[]>([]);

  const handleBulkDelete = (items: AssetItem[]) =>
    alert(`Deleting ${items.length} assets`);

  const columns: ColumnDef<AssetItem>[] = [
    {
      accessorKey: "name",
      header: "Asset Name",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "zerodhaToken",
      header: "Zerodha Token",
      cell: ({ row }) => <span>{row.original.zerodhaToken ?? "-"}</span>,
    },
    {
      accessorKey: "upstoxToken",
      header: "Upstox Token",
      cell: ({ row }) => <span>{row.original.upstoxToken ?? "-"}</span>,
    },
    {
      accessorKey: "angeloneToken",
      header: "Angel One Token",
      cell: ({ row }) => <span>{row.original.angeloneToken ?? "-"}</span>,
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
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const formFields: FormFieldConfig[] = [
    {
      name: "name",
      label: "Asset Name",
      type: "select",
      required: true,
      options: [
        { label: "NIFTY", value: "NIFTY" },
        { label: "SENSEX", value: "SENSEX" },
      ],
    },
    {
      name: "zerodhaToken",
      label: "Zerodha Token",
      type: "number",
      required: false,
    },
    {
      name: "upstoxToken",
      label: "Upstox Token",
      type: "text",
      required: false,
    },
    {
      name: "angeloneToken",
      label: "Angel One Token",
      type: "text",
      required: false,
    },
  ];

  return (
    <DynamicServerTable
      tableKey="asset"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      rowIdField="id"
      apiEndpoint="/api/asset"
      formFields={formFields}
      showAddButton={false}
      showEditButton={false}
      showDeleteButton={false}
      addButtonLabel="Add Asset"
      searchable
      searchPlaceholder="Search asset..."
      searchFields={["name"]}
      filters={[]}
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}
      exportable
      exportFileName="asset"
      exportConfig={{ csv: true, excel: true, pdf: true, print: true }}
      selectable
      onSelectionChange={setSelectedItems}
      bulkActions={[
        {
          label: "Delete Selected",
          icon: null,
          onClick: () => {}, // implement as needed
          variant: "destructive",
        },
      ]}
      viewerTitle="Asset Details"
      viewerSubtitle="Complete information"
      viewerFieldConfig={{
        id: { hidden: true },
        name: {
          label: "Asset Name",
        },
        zerodhaToken: { label: "Zerodha Token" },
        upstoxToken: { label: "Upstox Token" },
        angeloneToken: { label: "Angel One Token" },
        createdAt: {
          label: "Created On",
          format: (value: string) => new Date(value).toLocaleString("en-IN"),
        },
      }}
    />
  );
}
