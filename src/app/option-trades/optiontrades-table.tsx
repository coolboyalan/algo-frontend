"use client";

import { useState } from "react";
import { DynamicServerTable } from "@/components/table/dynamic-server-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TableParams, TableResponse } from "@/app/actions/table-data";
import type { FormFieldConfig } from "@/components/forms/auto-form-generator";
import {
  TrendingUp,
  TrendingDown,
  Hash,
  Calendar,
  DollarSign,
  BarChart3,
  Send,
  Trash2,
} from "lucide-react";

// Updated type to match your model
export type OptionTradesItem = {
  id: string;
  brokerKeyId: number;
  baseAssetId: number;
  direction: "CE" | "PE";
  quantity: number;
  type: "entry" | "exit";
  strikePrice: number;
  createdAt: string;
  updatedAt: string;
  // Relations (populated by backend)
  brokerKey?: {
    id: number;
    user?: {
      name: string;
    };
    broker?: {
      name: string;
    };
  };
  baseAsset?: {
    id: number;
    name: string;
    symbol: string;
  };
};

interface OptionTradesTableProps {
  initialData: TableResponse<OptionTradesItem>;
  fetchData: (params: TableParams) => Promise<TableResponse<OptionTradesItem>>;
}

export function OptionTradesTable({
  initialData,
  fetchData,
}: OptionTradesTableProps) {
  const [selectedItems, setSelectedItems] = useState<OptionTradesItem[]>([]);

  // ==================== BULK ACTIONS ====================
  const handleBulkDelete = (items: OptionTradesItem[]) => {
    console.log("Deleting items:", items);
    alert(`Deleting ${items.length} items`);
  };

  const handleBulkExport = (items: OptionTradesItem[]) => {
    console.log("Exporting items:", items);
    alert(`Exporting ${items.length} items`);
  };

  // ==================== COLUMNS ====================
  const columns: ColumnDef<OptionTradesItem>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-sm">{row.original.id}</span>
        </div>
      ),
    },
    {
      accessorKey: "brokerKey.user.name",
      header: "User",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.brokerKey?.user?.name || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "brokerKey.broker.name",
      header: "Broker",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.brokerKey?.broker?.name || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "baseAsset.symbol",
      header: "Asset",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-blue-600">
            {row.original.baseAsset?.symbol || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "direction",
      header: "Direction",
      cell: ({ row }) => (
        <Badge
          variant={row.original.direction === "CE" ? "default" : "secondary"}
          className={
            row.original.direction === "CE"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {row.original.direction === "CE" ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {row.original.direction}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.type === "entry" ? "default" : "outline"}>
          {row.original.type.toUpperCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "strikePrice",
      header: "Strike Price",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-purple-600" />
          <span className="font-semibold text-purple-600">
            ₹{row.original.strikePrice.toLocaleString("en-IN")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono font-semibold">{row.original.quantity}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Trade Time",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">
            {new Date(row.original.createdAt).toLocaleString("en-IN")}
          </span>
        </div>
      ),
    },
  ];

  // ==================== FORM FIELDS ====================
  const formFields: FormFieldConfig[] = [
    {
      name: "brokerKeyId",
      label: "Broker Key",
      type: "searchable-select",
      required: true,
      searchEndpoint: "/api/broker-key",
      searchFields: ["id", "userId", "brokerId"],
      searchResultLabelKey: "id", // You might want to customize this in backend to return "User - Broker"
      searchResultValueKey: "id",
      searchLimit: 20,
      placeholder: "Search broker key...",
      description: "Select the broker key for this trade",
    },
    {
      name: "baseAssetId",
      label: "Base Asset",
      type: "searchable-select",
      required: true,
      searchEndpoint: "/api/asset",
      searchFields: ["name", "symbol"],
      searchResultLabelKey: "symbol",
      searchResultValueKey: "id",
      searchLimit: 20,
      placeholder: "Search asset...",
      description: "Select the underlying asset (e.g., NIFTY, BANKNIFTY)",
    },
    {
      name: "direction",
      label: "Direction",
      type: "select",
      required: true,
      options: [
        { label: "Call (CE)", value: "CE" },
        { label: "Put (PE)", value: "PE" },
      ],
      description: "Call or Put option",
    },
    {
      name: "type",
      label: "Trade Type",
      type: "select",
      required: true,
      options: [
        { label: "Entry", value: "entry" },
        { label: "Exit", value: "exit" },
      ],
      description: "Entry or exit position",
    },
    {
      name: "strikePrice",
      label: "Strike Price",
      type: "number",
      placeholder: "18000",
      required: true,
      description: "Strike price of the option",
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      placeholder: "50",
      required: true,
      description: "Number of contracts/lots",
    },
  ];

  return (
    <DynamicServerTable
      tableKey="optiontrades"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      rowIdField="id"
      // ==================== CRUD WITH AUTO FORMS ====================
      apiEndpoint="/api/option-trade-log"
      formFields={formFields}
      showAddButton={true}
      showEditButton={true}
      showDeleteButton={true}
      addButtonLabel="Add Option Trade"
      // ==================== SEARCH ====================
      searchable
      searchPlaceholder="Search trades..."
      searchFields={["direction", "type", "strikePrice", "quantity"]}
      // ==================== FILTERS ====================
      filters={[
        {
          field: "direction",
          label: "Direction",
          type: "select",
          options: [
            { label: "Call (CE)", value: "CE" },
            { label: "Put (PE)", value: "PE" },
          ],
        },
        {
          field: "type",
          label: "Type",
          type: "select",
          options: [
            { label: "Entry", value: "entry" },
            { label: "Exit", value: "exit" },
          ],
        },
      ]}
      // ==================== SORTING ====================
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
      // ==================== PAGINATION ====================
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}
      // ==================== EXPORT ====================
      exportable
      exportFileName="option-trades"
      exportConfig={{
        csv: true,
        excel: true,
        pdf: true,
        print: true,
      }}
      // ==================== BULK ACTIONS ====================
      selectable
      onSelectionChange={setSelectedItems}
      bulkActions={[
        {
          label: "Export Selected",
          icon: <Send className="h-4 w-4" />,
          onClick: handleBulkExport,
          variant: "default",
        },
        {
          label: "Delete Selected",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleBulkDelete,
          variant: "destructive",
        },
      ]}
      // ==================== ROW VIEWER ====================
      viewerTitle="Option Trade Details"
      viewerSubtitle="Complete trade information"
      viewerFieldConfig={{
        id: { label: "Trade ID" },
        brokerKeyId: { label: "Broker Key ID" },
        baseAssetId: { label: "Base Asset ID" },
        direction: {
          label: "Direction",
          format: (value: string) => (
            <Badge
              variant={value === "CE" ? "default" : "secondary"}
              className={
                value === "CE"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {value === "CE" ? "Call (CE)" : "Put (PE)"}
            </Badge>
          ),
        },
        type: {
          label: "Type",
          format: (value: string) => (
            <Badge variant={value === "entry" ? "default" : "outline"}>
              {value.toUpperCase()}
            </Badge>
          ),
        },
        strikePrice: {
          label: "Strike Price",
          format: (value: number) => (
            <span className="text-purple-600 font-bold text-xl">
              ₹{value.toLocaleString("en-IN")}
            </span>
          ),
        },
        quantity: {
          label: "Quantity",
          format: (value: number) => (
            <span className="font-mono font-bold text-lg">{value}</span>
          ),
        },
        createdAt: {
          label: "Trade Time",
          format: (value: string) => new Date(value).toLocaleString("en-IN"),
        },
        updatedAt: {
          label: "Last Updated",
          format: (value: string) => new Date(value).toLocaleString("en-IN"),
        },
      }}
    />
  );
}
