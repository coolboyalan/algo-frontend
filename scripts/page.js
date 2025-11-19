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

// ==================== PAGE.TSX ====================
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

// ==================== TABLE.TSX ====================
const tableFileContent = `'use client';

import { useState } from 'react';
import { DynamicServerTable } from '@/components/table/dynamic-server-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye, Edit, Trash2, MoreHorizontal, User, Mail,
  DollarSign, FileText, Send, Printer
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableParams, TableResponse } from '@/app/actions/table-data';
import type { FormFieldConfig } from '@/components/forms/auto-form-generator';

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

  // ==================== BULK ACTIONS ====================
  const handleBulkDelete = (items: ${pageName}Item[]) => {
    console.log('Deleting items:', items);
    alert(\`Deleting \${items.length} items\`);
  };

  const handleBulkEmail = (items: ${pageName}Item[]) => {
    console.log('Emailing items:', items);
    alert(\`Sending emails to \${items.length} items\`);
  };

  // ==================== COLUMNS ====================
  const columns: ColumnDef<${pageName}Item>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a
            href={\`mailto:\${row.original.email}\`}
            className="text-blue-600 hover:underline"
          >
            {row.original.email}
          </a>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // ==================== FORM FIELDS (FOR CRUD) ====================
  const formFields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'email@example.com',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      placeholder: '1000',
      required: true,
    },
  ];

  // ==================== CUSTOM CRUD HANDLERS (OPTIONAL) ====================
  // Uncomment these if you want custom logic instead of default handlers

  // const handleCreate = async (data: Partial<${pageName}Item>) => {
  //   console.log('Creating:', data);
  //   // Your custom create logic here
  //   // const result = await customCreateAPI(data);
  //   // return result;
  // };

  // const handleUpdate = async (id: string, data: Partial<${pageName}Item>) => {
  //   console.log('Updating:', id, data);
  //   // Your custom update logic here
  // };

  // const handleDelete = async (id: string) => {
  //   console.log('Deleting:', id);
  //   // Your custom delete logic here
  // };

  return (
    <DynamicServerTable
      // ==================== BASIC CONFIG ====================
      tableKey="${pageNameLower}"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      rowIdField="id"

      // ==================== CRUD CONFIG ====================
      apiEndpoint="/api/${pageNameLower}"  // 🔥 REQUIRED FOR CRUD
      formFields={formFields}              // 🔥 REQUIRED FOR CRUD
      showAddButton={true}
      showEditButton={true}
      showDeleteButton={true}
      addButtonLabel="Add ${pageName}"

      // Custom CRUD handlers (optional - uncomment to use)
      // onCreateRecord={handleCreate}
      // onUpdateRecord={handleUpdate}
      // onDeleteRecord={handleDelete}

      // ==================== SEARCH CONFIG ====================
      searchable
      searchPlaceholder="Search ${pageNameLower}..."
      searchFields={['name', 'email', 'status']}

      // ==================== FILTER CONFIG ====================
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

      // ==================== SORTING CONFIG ====================
      defaultSortBy="createdAt"
      defaultSortOrder="desc"

      // ==================== PAGINATION CONFIG ====================
      pageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}

      // ==================== EXPORT CONFIG ====================
      exportable
      exportFileName="${pageNameLower}"
      exportConfig={{
        csv: true,
        excel: true,
        pdf: true,
        print: true,
      }}

      // ==================== SELECTION & BULK ACTIONS ====================
      selectable
      onSelectionChange={setSelectedItems}
      bulkActions={[
        {
          label: 'Send Email',
          icon: <Send className="h-4 w-4" />,
          onClick: handleBulkEmail,
          variant: 'default',
        },
        {
          label: 'Delete Selected',
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleBulkDelete,
          variant: 'destructive',
        },
      ]}

      // ==================== ROW VIEWER CONFIG ====================
      viewerTitle="${pageName} Details"
      viewerSubtitle="Complete information"
      viewerFieldConfig={{
        id: { hidden: true },
        amount: {
          format: (value: number) => (
            <span className="text-green-600 font-bold text-lg">
              ₹{value.toLocaleString('en-IN')}
            </span>
          ),
        },
        email: {
          format: (value: string) => (
            <a href={\`mailto:\${value}\`} className="text-blue-600 hover:underline">
              {value}
            </a>
          ),
        },
        status: {
          format: (value: string) => (
            <Badge variant={value === 'active' ? 'default' : 'destructive'}>
              {value}
            </Badge>
          ),
        },
      }}

      // ==================== CUSTOM FORMS (OPTIONAL) ====================
      // Uncomment these if you want completely custom forms

      // customAddForm={
      //   <div className="space-y-4">
      //     <h2>Custom Add Form</h2>
      //     {/* Your custom form JSX here */}
      //   </div>
      // }

      // customEditForm={(data) => (
      //   <div className="space-y-4">
      //     <h2>Custom Edit Form for {data.name}</h2>
      //     {/* Your custom edit form JSX here */}
      //   </div>
      // )}

      // ==================== CUSTOM ROW VIEWER (OPTIONAL) ====================
      // customRowViewer={(data) => (
      //   <div className="space-y-4">
      //     <h2 className="text-2xl font-bold">{data.name}</h2>
      //     <div className="grid grid-cols-2 gap-4">
      //       <div>
      //         <label className="text-sm text-muted-foreground">Email</label>
      //         <p>{data.email}</p>
      //       </div>
      //       <div>
      //         <label className="text-sm text-muted-foreground">Status</label>
      //         <Badge variant={data.status === 'active' ? 'default' : 'destructive'}>
      //           {data.status}
      //         </Badge>
      //       </div>
      //     </div>
      //     {/* Your custom viewer content */}
      //   </div>
      // )}
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

  console.log(`\n✅ Successfully created ${pageName} page!\n`);
  console.log(`📁 Files created:`);
  console.log(`   - ${pageFile}`);
  console.log(`   - ${tableFile}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Update the type definition with your actual fields`);
  console.log(`   2. Update formFields to match your data structure`);
  console.log(`   3. Customize columns as needed`);
  console.log(`   4. Add the route to your sidebar config\n`);
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
