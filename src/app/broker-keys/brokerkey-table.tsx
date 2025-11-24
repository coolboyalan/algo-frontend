"use client";

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
};

const columns: ColumnDef<BrokerKeyItem>[] = [
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => <span>{row.original.userId}</span>,
  },
  {
    accessorKey: "brokerId",
    header: "Broker ID",
    cell: ({ row }) => <span>{row.original.brokerId}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={row.original.type === "buying" ? "default" : "secondary"}>
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <span>{row.original.type}</span>,
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
  { name: "userId", label: "User ID", type: "number", required: true },
  { name: "brokerId", label: "Broker ID", type: "number", required: true },
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
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
  { name: "balance", label: "Balance", type: "text" },
  { name: "loginUrl", label: "Login URL", type: "text" },
  { name: "redirectUrl", label: "Redirect URL", type: "text" },
  {
    name: "profitLimit",
    label: "Profit Limit",
    type: "number",
    required: true,
    // min: 1,
    // max: 10000,
  },
  {
    name: "lossLimit",
    label: "Loss Limit",
    type: "number",
    required: true,
    // min: 0,
    // max: 100,
  },
  {
    name: "usableFund",
    label: "Usable Fund",
    type: "number",
    required: true,
    // min: 0,
    // max: 100,
  },
  {
    name: "timeFrame",
    label: "Time Frame",
    type: "number",
    required: true,
    // min: 0,
  },
  { name: "token", label: "Token", type: "text" },
  { name: "tokenDate", label: "Token Date", type: "date" },
];

export function BrokerKeyTable({
  initialData,
  fetchData,
}: {
  initialData: TableResponse<BrokerKeyItem>;
  fetchData: (params: TableParams) => Promise<TableResponse<BrokerKeyItem>>;
}) {
  const [selectedRows, setSelectedRows] = useState<BrokerKeyItem[]>([]);
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
