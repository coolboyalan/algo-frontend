"use client";

import { useState } from "react";
import { DynamicServerTable } from "@/components/table/dynamic-server-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TableParams, TableResponse } from "@/app/actions/table-data";
import type { FormFieldConfig } from "@/components/forms/auto-form-generator";
import {
  User,
  Mail,
  DollarSign,
  Trash2,
  Send,
  Hash,
  Calendar,
} from "lucide-react";
import type { PaymentsItem } from "./page";

interface PaymentsTableProps {
  initialData: TableResponse<PaymentsItem>;
  fetchData: (params: TableParams) => Promise<TableResponse<PaymentsItem>>;
}

export function PaymentsTable({ initialData, fetchData }: PaymentsTableProps) {
  const [selectedItems, setSelectedItems] = useState<PaymentsItem[]>([]);

  // ==================== BULK ACTIONS ====================
  const handleBulkDelete = (items: PaymentsItem[]) => {
    console.log("Deleting items:", items);
    alert(`Deleting ${items.length} items`);
  };

  const handleBulkEmail = (items: PaymentsItem[]) => {
    console.log("Emailing items:", items);
    alert(`Sending emails to ${items.length} items`);
  };

  // ==================== COLUMNS ====================
  const columns: ColumnDef<PaymentsItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const variant =
          row.original.status === "active"
            ? "default"
            : row.original.status === "pending"
              ? "secondary"
              : "destructive";

        return <Badge variant={variant}>{row.original.status}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">
            {new Date(row.original.createdAt).toLocaleDateString("en-IN")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-green-600">
            ₹{row.original.amount.toLocaleString("en-IN")}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
    },
  ];

  // ==================== FORM FIELDS ====================
  const formFields: FormFieldConfig[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter name",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "email@example.com",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      placeholder: "1000",
      required: true,
    },
  ];

  return (
    <DynamicServerTable
      tableKey="payments"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      rowIdField="id"
      // ==================== CRUD WITH AUTO FORMS ====================
      apiEndpoint="/api/payments"
      formFields={formFields}
      showAddButton
      showEditButton
      showDeleteButton
      addButtonLabel="Add Payments"
      // ==================== CUSTOM FORMS (OPTIONAL) ====================
      // Uncomment to use custom forms instead of auto-generated ones

      // customAddForm={
      //   <CustomPaymentsForm
      //     onSuccess={() => router.refresh()}
      //   />
      // }

      // customEditForm={(data) => (
      //   <CustomPaymentsForm
      //     onSuccess={() => router.refresh()}
      //     defaultValues={data}
      //     isEdit
      //   />
      // )}

      // ==================== SEARCH ====================
      searchable
      searchPlaceholder="Search payments..."
      searchFields={["name", "email", "status"]}
      // ==================== FILTERS ====================
      filters={[
        {
          field: "status",
          label: "Status",
          type: "multiselect",
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Pending", value: "pending" },
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
      exportFileName="payments"
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
          label: "Send Email",
          icon: <Send className="h-4 w-4" />,
          onClick: handleBulkEmail,
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
      viewerTitle="Payments Details"
      viewerSubtitle="Complete information"
      viewerFieldConfig={{
        id: { hidden: true },
        amount: {
          label: "Amount",
          format: (value: number) => (
            <span className="text-green-600 font-bold text-xl">
              ₹{value.toLocaleString("en-IN")}
            </span>
          ),
        },
        email: {
          label: "Email Address",
          format: (value: string) => (
            <a
              href={`mailto:${value}`}
              className="text-blue-600 hover:underline"
            >
              {value}
            </a>
          ),
        },
        status: {
          label: "Status",
          format: (value: string) => (
            <Badge
              variant={
                value === "active"
                  ? "default"
                  : value === "pending"
                    ? "secondary"
                    : "destructive"
              }
              className="text-sm"
            >
              {value.toUpperCase()}
            </Badge>
          ),
        },
        createdAt: {
          label: "Created On",
          format: (value: string) => new Date(value).toLocaleString("en-IN"),
        },
      }}
    />
  );
}
