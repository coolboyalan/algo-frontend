"use client";
import { toast } from "sonner";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DynamicServerTable } from "@/components/table/dynamic-server-table";
import { TableParams, TableResponse } from "@/app/actions/table-data";
import type { FormFieldConfig } from "@/components/forms/auto-form-generator";
import {
  User,
  Mail,
  DollarSign,
  Calendar,
  Hash,
  Link as LinkIcon,
  Copy,
  Check,
} from "lucide-react";

export type BrokerKeyItem = {
  id: string;
  userId: number;
  brokerId: number;
  apiKey: string;
  apiSecret: string;
  token?: string;
  tokenDate?: string;
  status: boolean;
  balance?: string;
  loginUrl?: string;
  redirectUrl?: string;
  profitLimit: number;
  lossLimit: number;
  usableFund: number;
  timeFrame: number;
  type: "buying" | "selling";
  createdAt: string;
  user: {
    name: string;
    id: number;
  };
  broker: {
    name: string;
    id: number;
  };
};

export function BrokerKeyTable({
  initialData,
  fetchData,
  userRole,
}: {
  initialData: TableResponse<BrokerKeyItem>;
  fetchData: (params: TableParams) => Promise<TableResponse<BrokerKeyItem>>;
  userRole?: string;
}) {
  const [selectedRows, setSelectedRows] = useState<BrokerKeyItem[]>([]);

  const columns: ColumnDef<BrokerKeyItem>[] = [
    {
      accessorKey: "user.name",
      header: "User Name",
      cell: ({ row }) => <span>{row.original.user.name}</span>,
    },
    {
      accessorKey: "broker.name",
      header: "Broker Name",
      cell: ({ row }) => <span>{row.original.broker.name}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant={row.original.type === "buying" ? "default" : "secondary"}
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "apiKey",
      header: "API Key",
      cell: ({ row }) => (
        <span className="truncate max-w-[120px]" title={row.original.apiKey}>
          {row.original.apiKey}
        </span>
      ),
    },
    {
      accessorKey: "apiSecret",
      header: "API Secret",
      cell: ({ row }) => (
        <span className="truncate max-w-[120px]" title={row.original.apiSecret}>
          {row.original.apiSecret}
        </span>
      ),
    },
    {
      accessorKey: "redirectUrl",
      header: "Redirect URL",
      cell: ({ row }) => {
        const [copied, setCopied] = useState(false);

        const copy = async () => {
          const url = `${row.original.redirectUrl}`;

          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(url);
            } else {
              // Fallback
              const textArea = document.createElement("textarea");
              textArea.value = url;
              textArea.style.position = "fixed";
              textArea.style.left = "-999999px";
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand("copy");
              document.body.removeChild(textArea);
            }

            setCopied(true);
            toast.success("URL copied to clipboard!"); // ✅ Better feedback
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error("Copy failed:", err);
            toast.error("Failed to copy URL"); // ✅ Show error
          }
        };

        return (
          <button
            onClick={copy}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline active:text-blue-800 touch-manipulation"
          >
            <span className="truncate max-w-[200px]">Click to copy</span>
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        ),
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => <span>{row.original.balance ?? "-"}</span>,
    },
    {
      accessorKey: "profitLimit",
      header: "Profit Limit",
      cell: ({ row }) => <span>{row.original.profitLimit}</span>,
    },
    {
      accessorKey: "lossLimit",
      header: "Loss Limit",
      cell: ({ row }) => <span>{row.original.lossLimit}</span>,
    },
    {
      accessorKey: "usableFund",
      header: "Usable Fund",
      cell: ({ row }) => <span>{row.original.usableFund}</span>,
    },
    {
      accessorKey: "loginUrl",
      header: "Login URL",
      cell: ({ row }) =>
        row.original.loginUrl ? (
          <a
            href={row.original.loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            <LinkIcon className="h-4 w-4 inline mr-1" />
            Link
          </a>
        ) : (
          "-"
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <span>
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString("en-IN")
            : "-"}
        </span>
      ),
    },
  ];

  const formFields: FormFieldConfig[] = [
    {
      name: "userId",
      label: "User Name",
      type: "searchable-select",
      required: true,
      searchEndpoint: "/api/user",
      searchFields: ["name"],
      searchResultLabelKey: "name",
      searchResultValueKey: "id",
      searchLimit: 20,
      placeholder: "Search for an user...",
      showWhen: {
        condition: () => {
          console.log(userRole);
          return userRole !== "user";
        },
      },
    },
    {
      name: "brokerId",
      label: "Broker",
      type: "searchable-select",
      required: true,
      searchEndpoint: "/api/broker",
      searchFields: ["name"],
      searchResultLabelKey: "name",
      searchResultValueKey: "id",
      searchLimit: 20,
      placeholder: "Search for a broker...",
    },
    { name: "apiKey", label: "API Key", type: "text", required: true },
    { name: "apiSecret", label: "API Secret", type: "text", required: true },
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: [
        { label: "Buying", value: "buying" },
        { label: "Selling", value: "selling" },
      ],
    },
    {
      name: "balance",
      label: "Available Balance",
      type: "number",
      required: true,
      defaultValue: 0,
      prefix: "₹",
      disabled: true, // User can't change balance
      description: "Your current account balance",
    },
    {
      name: "profitLimit",
      label: "Profit Limit",
      type: "number",
      required: true,
      prefix: "₹",
      placeholder: "Enter profit limit amount",
      description: "Set your profit limit in rupees",
      min: 0,
    },
    {
      name: "lossLimit",
      label: "Loss Limit",
      type: "number",
      required: true,
      prefix: "₹",
      placeholder: "Enter loss limit amount",
      min: 0,
      max: 100,
    },
    {
      name: "usableFund",
      label: "Usable Fund",
      type: "number",
      required: true,
      prefix: "₹",
      showWhen: {
        field: "status",
        condition: (value: boolean) => {
          return value === true;
        },
      },
      dynamicMin: {
        field: "balance",
        calculate: () => 0,
      },
      dynamicMax: {
        field: "balance",
        calculate: (balance) => balance || 0, // ✅ Receives balance value
      },
    },

    {
      name: "timeFrame",
      label: "Time Frame",
      type: "number",
      required: true,
    },
  ];

  return (
    <DynamicServerTable
      tableKey="brokerkey"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      rowIdField="id"
      apiEndpoint="/api/broker-key"
      formFields={formFields}
      selectable
      onSelectionChange={setSelectedRows}
      showAddButton={true}
      showEditButton={true}
      showDeleteButton={true}
      addButtonLabel="Add BrokerKey"
      searchFields={["userId", "brokerId", "apiKey", "balance", "type"]}
      filters={[
        {
          field: "type",
          label: "Type",
          type: "select",
          options: [
            { label: "Buying", value: "buying" },
            { label: "Selling", value: "selling" },
          ],
        },
      ]}
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}
      exportable
      exportFileName="brokerkey"
      exportConfig={{ csv: true, excel: true, pdf: true, print: true }}
    />
  );
}
