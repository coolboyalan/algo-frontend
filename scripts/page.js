const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(
    "Usage: npm run page -- create <PageName> OR npm run page -- delete <PageName>",
  );
  process.exit(1);
}

const action = args[0];
const pageNameOriginal = args[1];
if (!pageNameOriginal) {
  console.error("Please specify the page name");
  process.exit(1);
}

const pageNameLower = pageNameOriginal.toLowerCase();
const pageName =
  pageNameOriginal.charAt(0).toUpperCase() + pageNameOriginal.slice(1);

const dirPath = path.resolve(`src/app/${pageNameLower}`);

function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

if (action === "delete") {
  if (!fs.existsSync(dirPath)) {
    console.error("Page directory does not exist:", dirPath);
    process.exit(1);
  }
  deleteFolderRecursive(dirPath);
  console.log(`🗑️ Deleted page directory: ${dirPath}`);
  process.exit(0);
}

const pageFileContent = `import { fetchTableData, TableParams } from '@/app/actions/table-data';
import { ${pageName}Table } from './${pageNameLower}-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CheckCircle, XCircle, DollarSign, Users } from 'lucide-react';

type ${pageName}Item = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
  amount: number;
};

const sample${pageName}: ${pageName}Item = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  status: 'active',
  createdAt: new Date().toISOString(),
  amount: 1234,
};

export default async function ${pageName}Page() {
  const initialData = await fetchTableData<${pageName}Item>(
    '/api/${pageNameLower}',
    {
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    sample${pageName}
  );

  async function fetch${pageName}Data(params: TableParams) {
    'use server';
    return fetchTableData<${pageName}Item>('/api/${pageNameLower}', params);
  }

  const totalItems = initialData.pagination.totalCount || 0;
  const activeItems = initialData.data.filter(item => item.status === 'active').length;
  const inactiveItems = initialData.data.filter(item => item.status === 'inactive').length;
  const totalAmount = initialData.data.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            ${pageName} Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all ${pageNameLower} records
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total ${pageName}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">All time records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeItems}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{inactiveItems}</div>
              <p className="text-xs text-muted-foreground">Currently inactive</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-muted-foreground">Sum of all amounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <${pageName}Table initialData={initialData} fetchData={fetch${pageName}Data} />
      </div>
    </div>
  );
}
`;

const tableFileContent = `'use client';

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

type ${pageName}Item = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
  amount: number;
};

interface ${pageName}TableProps {
  initialData: TableResponse<${pageName}Item>;
  fetchData: (params: TableParams) => Promise<TableResponse<${pageName}Item>>;
}

export function ${pageName}Table({ initialData, fetchData }: ${pageName}TableProps) {
  const [selectedItems, setSelectedItems] = useState<${pageName}Item[]>([]);

  const handleBulkDelete = (items: ${pageName}Item[]) => {
    alert(\`Deleting \${items.length} items\`);
  };

  const columns: ColumnDef<${pageName}Item>[] = [
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
	  tableKey="${pageNameLower}"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      searchable
      searchPlaceholder="Search ${pageNameLower}..."
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
      exportFileName="${pageNameLower}"
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
      viewerTitle="${pageName} Details"
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
`;

function createPage() {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  const pageFile = path.join(dirPath, "page.tsx");
  const tableFile = path.join(dirPath, `${pageNameLower}-table.tsx`);

  if (fs.existsSync(pageFile) || fs.existsSync(tableFile)) {
    console.error(
      `Error: Page or Table file already exists for ${pageNameOriginal}`,
    );
    process.exit(1);
  }

  fs.writeFileSync(pageFile, pageFileContent, "utf8");
  fs.writeFileSync(tableFile, tableFileContent, "utf8");
  console.log(`✔️ Created ${pageFile} and ${tableFile}`);
}

if (action === "create") {
  createPage();
} else if (action === "delete") {
  if (!fs.existsSync(dirPath)) {
    console.error("Page directory does not exist:", dirPath);
    process.exit(1);
  }
  deleteFolderRecursive(dirPath);
  console.log(`🗑️ Deleted page directory: ${dirPath}`);
} else {
  console.error("Invalid action:", action);
  console.error('Use "create" or "delete"');
  process.exit(1);
}
