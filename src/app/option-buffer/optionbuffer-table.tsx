"use client";

import { useState } from "react";
import { DynamicServerTable } from "@/components/table/dynamic-server-table";
import { ColumnDef } from "@tanstack/react-table";
import { TableParams, TableResponse } from "@/app/actions/table-data";
import type { FormFieldConfig } from "@/components/forms/auto-form-generator";
import { Calendar, Trash2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type OptionBufferItem = {
  id: string;
  value: number; // main field in your model
  createdAt: string;
};

interface OptionBufferTableProps {
  initialData: TableResponse<OptionBufferItem>;
  fetchData: (params: TableParams) => Promise<TableResponse<OptionBufferItem>>;
}

export function OptionBufferTable({
  initialData,
  fetchData,
}: OptionBufferTableProps) {
  const [selectedItems, setSelectedItems] = useState<OptionBufferItem[]>([]);

  const handleBulkDelete = (items: OptionBufferItem[]) => {
    alert(`Deleting ${items.length} option buffer item(s)`);
  };

  const columns: ColumnDef<OptionBufferItem>[] = [
    {
      accessorKey: "value",
      header: "Value",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.value}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      enableSorting: true,
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString("en-IN"),
    },
  ];

  const formFields: FormFieldConfig[] = [
    {
      name: "value",
      label: "Value",
      type: "number",
      placeholder: "Enter value divisible by 100",
      required: true,
    },
  ];

  return (
    <DynamicServerTable
      tableKey="optionbuffer"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      rowIdField="id"
      apiEndpoint="/api/option-buffer"
      formFields={formFields}
      showAddButton={true}
      showEditButton={true}
      showDeleteButton={true}
      addButtonLabel="Add OptionBuffer"
      searchable
      searchPlaceholder="Search option buffer value..."
      searchFields={["value"]}
      filters={[]}
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}
      exportable
      exportFileName="optionbuffer"
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
      viewerTitle="OptionBuffer Details"
      viewerSubtitle="Complete information"
      viewerFieldConfig={{
        id: { hidden: true },
        value: {
          label: "Value",
          format: (value: number) => <span className="font-bold">{value}</span>,
        },
        createdAt: {
          label: "Created On",
          format: (value: string) => new Date(value).toLocaleString("en-IN"),
        },
      }}
    />
  );
}
