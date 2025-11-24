"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DynamicServerTable } from "@/components/table/dynamic-server-table";
import { TableParams, TableResponse } from "@/app/actions/table-data";
import type { FormFieldConfig } from "@/components/forms/auto-form-generator";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Shield } from "lucide-react";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: string;
};

const columns: ColumnDef<UserItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <a
          href={`mailto:${row.original.email}`}
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.email}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === "admin" ? "default" : "secondary"}>
        <Shield className="h-3 w-3 mr-1 inline" />
        {row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)}
      </Badge>
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
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Full Name",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "user@example.com",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "text",
    placeholder: "Enter password",
    required: true,
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: [
      { label: "User", value: "user" },
      { label: "Admin", value: "admin" },
    ],
  },
];

export function UserTable({
  initialData,
  fetchData,
}: {
  initialData: TableResponse<UserItem>;
  fetchData: (params: TableParams) => Promise<TableResponse<UserItem>>;
}) {
  const [selectedRows, setSelectedRows] = useState<UserItem[]>([]);
  return (
    <DynamicServerTable
      tableKey="user"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      formFields={formFields}
      rowIdField="id"
      apiEndpoint="/api/user"
      selectable
      onSelectionChange={setSelectedRows}
      showAddButton={true}
      showEditButton={true}
      showDeleteButton={true}
      addButtonLabel="Add User"
      searchFields={["name", "email", "role"]}
      filters={[
        {
          field: "role",
          label: "Role",
          type: "select",
          options: [
            { label: "User", value: "user" },
            { label: "Admin", value: "admin" },
          ],
        },
      ]}
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}
      exportable
      exportFileName="users"
      exportConfig={{ csv: true, excel: true, pdf: true, print: true }}
    />
  );
}
