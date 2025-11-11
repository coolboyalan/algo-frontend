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

// Templates for creating files

const pageFileContent = `import { fetchTableData, TableParams } from '@/app/actions/table-data';
import { ${pageName}Table } from './${pageNameLower}-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ${pageName}Page() {
  async function fetchData(params: TableParams) {
    'use server';
    return fetchTableData('/api/${pageNameLower}', params);
  }

  const sampleRecord = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    createdAt: new Date().toISOString(),
    amount: 1234,
  };

  const initialData = await fetchTableData('/api/${pageNameLower}', {
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  }, sampleRecord);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>${pageName} Management</CardTitle>
        </CardHeader>
        <CardContent>
          <${pageName}Table initialData={initialData} fetchData={fetchData} />
        </CardContent>
      </Card>
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
      cell: ({ row }) => row.original.email,
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
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      enableSorting: true,
      cell: ({ row }) => <span className="font-semibold">₹{row.original.amount.toFixed(2)}</span>,
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
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      searchable
      searchPlaceholder="Search items..."
      searchFields={['name', 'email', 'status']}
      filters={[
        {
          field: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
        },
      ]}
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
      exportable
      exportFileName="${pageNameLower}"
      selectable
      rowIdField="id"
      onSelectionChange={setSelectedItems}
      bulkActions={[
        {
          label: 'Delete Selected',
          variant: 'destructive',
          onClick: handleBulkDelete,
        },
      ]}
      viewerTitle="${pageName} Details"
      viewerSubtitle="Detailed information"
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
