'use client';

import { useState } from 'react';
import { DynamicServerTable } from '@/components/table/dynamic-server-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, MoreHorizontal, User, Mail, DollarSign } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableParams, TableResponse } from '@/app/actions/table-data';

type PaymentsItem = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
  amount: number;
};

interface PaymentsTableProps {
  initialData: TableResponse<PaymentsItem>;
  fetchData: (params: TableParams) => Promise<TableResponse<PaymentsItem>>;
}

export function PaymentsTable({ initialData, fetchData }: PaymentsTableProps) {
  const [selectedItems, setSelectedItems] = useState<PaymentsItem[]>([]);

  const handleBulkDelete = (items: PaymentsItem[]) => {
    alert(`Deleting ${items.length} items`);
  };

  const columns: ColumnDef<PaymentsItem>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {row.original.email}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'destructive'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('en-IN'),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-green-600">
            ₹{row.original.amount.toLocaleString('en-IN')}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Send Email</DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <DynamicServerTable
	  tableKey='payments'
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      searchable
      searchPlaceholder="Search payments..."
      searchFields={['name', 'email', 'status']}
      filters={[
        {
          field: 'status',
          label: 'Status',
          type: 'multiselect',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
        },
      ]}
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}
      exportable
      exportFileName="payments"
      exportConfig={{
        csv: true,
        excel: true,
        pdf: true,
        print: true,
      }}
      selectable
      rowIdField="id"
      onSelectionChange={setSelectedItems}
      bulkActions={[
        {
          label: 'Delete',
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleBulkDelete,
          variant: 'destructive',
        },
      ]}
      viewerTitle="Payments Details"
      viewerSubtitle="Detailed information"
      viewerFieldConfig={{
        id: { hidden: true },
        amount: {
          format: (value: number) => (
            <span className="text-green-600 font-bold text-lg">
              ₹{value.toLocaleString('en-IN')}
            </span>
          ),
        },
      }}
    />
  );
}
