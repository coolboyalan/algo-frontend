"use client";

import { useState } from "react";
import { DynamicServerTable } from "@/components/table/dynamic-server-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Building2, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableParams, TableResponse } from "@/app/actions/table-data";
import { FormFieldConfig } from "@/components/forms/auto-form-generator";

type Broker = {
  id: string;
  name: "Zerodha" | "Upstox" | "Angel One";
  createdAt: string;
};

interface BrokersTableProps {
  initialData: TableResponse<Broker>;
  fetchData: (params: TableParams) => Promise<TableResponse<Broker>>;
}

export function BrokersTable({ initialData, fetchData }: BrokersTableProps) {
  const [selectedBrokers, setSelectedBrokers] = useState<Broker[]>([]);

  // Bulk action handlers
  const handleBulkDelete = async (brokers: Broker[]) => {
    if (confirm(`Delete ${brokers.length} broker(s)?`)) {
      console.log("Deleting:", brokers);
      alert(`Deleted ${brokers.length} brokers`);
    }
  };

  // Helper function to get broker badge color
  const getBrokerColor = (brokerName: string) => {
    switch (brokerName) {
      case "Zerodha":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Upstox":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Angel One":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "";
    }
  };

  // Form fields for Add/Edit
  const brokerFormFields: FormFieldConfig[] = [
    {
      name: "name",
      label: "Broker Name",
      type: "select",
      required: true,
      options: [
        { label: "Zerodha", value: "Zerodha" },
        { label: "Upstox", value: "Upstox" },
        { label: "Angel One", value: "Angel One" },
      ],
    },
  ];

  const columns: ColumnDef<Broker>[] = [
    {
      accessorKey: "name",
      header: "Broker Name",
      enableSorting: true,
      cell: ({ row }) => {
        const broker = row.original;
        return (
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <Badge className={getBrokerColor(broker.name)} variant="secondary">
              {broker.name}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      enableSorting: true,
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        );
      },
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
              <Edit className="mr-2 h-4 w-4" />
              Edit Broker
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Broker
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DynamicServerTable
      tableKey="brokers"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      apiEndpoint="/api/broker"
      formFields={brokerFormFields}
      searchable
      searchPlaceholder="Search by broker name..."
      searchFields={["name"]}
      filters={[
        {
          field: "name",
          label: "Broker Name",
          type: "multiselect",
          options: [
            { label: "Zerodha", value: "Zerodha" },
            { label: "Upstox", value: "Upstox" },
            { label: "Angel One", value: "Angel One" },
          ],
        },
      ]}
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}
      exportable
      exportFileName="brokers"
      exportConfig={{ csv: true, excel: true, pdf: true, print: true }}
      selectable
      rowIdField="id"
      onSelectionChange={setSelectedBrokers}
      bulkActions={[
        {
          label: "Delete",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleBulkDelete,
          variant: "destructive",
        },
      ]}
      viewerTitle="Broker"
      viewerSubtitle="Broker information"
      viewerFieldConfig={{
        id: { hidden: true },
        name: {
          label: "Broker Name",
          icon: <Building2 className="h-4 w-4" />,
        },
      }}
      showAddButton={false}
      addButtonLabel="Add Broker"
      showEditButton={false}
      showDeleteButton
    />
  );
}
