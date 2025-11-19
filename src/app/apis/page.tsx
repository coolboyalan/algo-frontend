import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen, Code, Rocket, Settings, Search, Filter,
  Download, Trash2, Eye, Edit, Table as TableIcon,
  Smartphone, Keyboard, Zap, Database, FileText,
  Mail, Send, Archive, Bell, UserPlus, CheckCircle,
  XCircle, AlertCircle, Info, Plus, Minus, Printer
} from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">DynamicServerTable Documentation</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Complete guide with detailed examples for every single feature, prop, and configuration option
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Props</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50+</div>
              <p className="text-xs text-muted-foreground">Configurable options</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20+</div>
              <p className="text-xs text-muted-foreground">Built-in features</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Form Types</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8+</div>
              <p className="text-xs text-muted-foreground">Input field types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Export Formats</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">CSV, Excel, PDF, Print</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Documentation */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="props">Props</TabsTrigger>
            <TabsTrigger value="crud">CRUD</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="bulk">Bulk</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          {/* ==================== OVERVIEW ==================== */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  DynamicServerTable is a production-ready, feature-rich table component for Next.js 14+
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <Database className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Server-Side Pagination</p>
                        <p className="text-sm text-muted-foreground">Cursor-based pagination for optimal performance with large datasets</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Search className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Multi-Field Search</p>
                        <p className="text-sm text-muted-foreground">Search across multiple columns with 500ms debouncing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Filter className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Advanced Filtering</p>
                        <p className="text-sm text-muted-foreground">Select and multiselect filters with active badges</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Download className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Data Export</p>
                        <p className="text-sm text-muted-foreground">Export to CSV, Excel, PDF, or Print</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Edit className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Full CRUD Operations</p>
                        <p className="text-sm text-muted-foreground">Create, Read, Update, Delete with auto-generated forms</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Smartphone className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Mobile Responsive</p>
                        <p className="text-sm text-muted-foreground">Auto-switches to card view on mobile devices</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Bulk Actions</p>
                        <p className="text-sm text-muted-foreground">Perform actions on multiple selected rows</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Eye className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Custom Viewers</p>
                        <p className="text-sm text-muted-foreground">Fully customizable row detail viewers</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`import { DynamicServerTable } from '@/components/table/dynamic-server-table';

<DynamicServerTable
  initialData={data}
  columns={columns}
  fetchData={fetchFunction}
  searchable
  exportable
  selectable
/>`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== PROPS ==================== */}
          <TabsContent value="props" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Complete Props Reference</CardTitle>
                <CardDescription>Every single prop with types, defaults, and examples</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Required Props */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="destructive">Required</Badge>
                    Core Props
                  </h3>
                  <div className="space-y-3">
                    <PropDoc
                      name="initialData"
                      type="TableResponse<T>"
                      required
                      description="Initial data fetched from server with pagination info"
                      example={`{
  data: [...],
  pagination: {
    hasNextPage: true,
    nextCursor: "abc123",
    totalCount: 100
  }
}`}
                    />
                    <PropDoc
                      name="columns"
                      type="ColumnDef<T>[]"
                      required
                      description="TanStack Table column definitions with accessors and cell formatters"
                      example={`[
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    cell: ({ row }) => row.original.name
  }
]`}
                    />
                    <PropDoc
                      name="fetchData"
                      type="(params: TableParams) => Promise<TableResponse<T>>"
                      required
                      description="Async function to fetch data from server with params"
                      example={`async (params) => {
  'use server';
  return fetchTableData('/api/users', params);
}`}
                    />
                  </div>
                </div>

                <Separator />

                {/* CRUD Props */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">CRUD Operations Props</h3>
                  <div className="space-y-3">
                    <PropDoc
                      name="apiEndpoint"
                      type="string"
                      description="Base API endpoint for CRUD operations. Required if using default handlers."
                      example="/api/users"
                    />
                    <PropDoc
                      name="formFields"
                      type="FormFieldConfig[]"
                      description="Configuration array for auto-generated form fields. Required for CRUD."
                      example={`[
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'john@example.com'
  }
]`}
                    />
                    <PropDoc
                      name="onCreateRecord"
                      type="(data: Partial<T>) => Promise<T>"
                      description="Custom create handler. Overrides default POST request to apiEndpoint."
                      example={`async (data) => {
  const result = await customCreate(data);
  toast.success('Created!');
  return result;
}`}
                    />
                    <PropDoc
                      name="onUpdateRecord"
                      type="(id: string, data: Partial<T>) => Promise<T>"
                      description="Custom update handler. Overrides default PUT request."
                      example={`async (id, data) => {
  return await customUpdate(id, data);
}`}
                    />
                    <PropDoc
                      name="onDeleteRecord"
                      type="(id: string) => Promise<void>"
                      description="Custom delete handler. Overrides default DELETE request."
                      example={`async (id) => {
  await customDelete(id);
  revalidatePath('/users');
}`}
                    />
                    <PropDoc
                      name="showAddButton"
                      type="boolean"
                      defaultValue="true"
                      description="Show or hide the Add New button in toolbar"
                    />
                    <PropDoc
                      name="showEditButton"
                      type="boolean"
                      defaultValue="true"
                      description="Show or hide Edit icon in row actions"
                    />
                    <PropDoc
                      name="showDeleteButton"
                      type="boolean"
                      defaultValue="true"
                      description="Show or hide Delete icon in row actions"
                    />
                    <PropDoc
                      name="addButtonLabel"
                      type="string"
                      defaultValue="'Add'"
                      description="Custom text for the Add button"
                      example="'Create New User'"
                    />
                  </div>
                </div>

                <Separator />

                {/* Search Props */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Search Configuration Props</h3>
                  <div className="space-y-3">
                    <PropDoc
                      name="searchable"
                      type="boolean"
                      defaultValue="true"
                      description="Enable or disable search functionality"
                    />
                    <PropDoc
                      name="searchPlaceholder"
                      type="string"
                      defaultValue="'Search...'"
                      description="Placeholder text for search input"
                      example="'Search by name, email, or phone...'"
                    />
                    <PropDoc
                      name="searchFields"
                      type="string[]"
                      description="Array of field names to search in. Searches all fields if not specified."
                      example="['name', 'email', 'phone', 'company']"
                    />
                  </div>
                </div>

                <Separator />

                {/* Filter Props */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Filter Configuration Props</h3>
                  <div className="space-y-3">
                    <PropDoc
                      name="filters"
                      type="FilterConfig[]"
                      description="Array of filter configurations for select and multiselect filters"
                      example={`[
  {
    field: 'status',
    label: 'Status',
    type: 'multiselect',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  }
]`}
                    />
                  </div>
                </div>

                <Separator />

                {/* Sorting Props */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Sorting Configuration Props</h3>
                  <div className="space-y-3">
                    <PropDoc
                      name="defaultSortBy"
                      type="string"
                      description="Initial column to sort by on first load"
                      example="'createdAt'"
                    />
                    <PropDoc
                      name="defaultSortOrder"
                      type="'asc' | 'desc'"
                      defaultValue="'asc'"
                      description="Initial sort direction"
                      example="'desc'"
                    />
                  </div>
                </div>

                <Separator />

                {/* Pagination Props */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Pagination Configuration Props</h3>
                  <div className="space-y-3">
                    <PropDoc
                      name="pageSize"
                      type="number"
                      defaultValue="10"
                      description="Number of items per page"
                      example="25"
                    />
                    <PropDoc
                      name="pageSizeOptions"
                      type="number[]"
                      defaultValue="[10, 25, 50, 100]"
                      description="Available page size options in dropdown"
                      example="[5, 10, 20, 50, 100]"
                    />
                  </div>
                </div>

                <Separator />

                {/* Export Props */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Export Configuration Props</h3>
                  <div className="space-y-3">
                    <PropDoc
                      name="exportable"
                      type="boolean"
                      defaultValue="false"
                      description="Enable export dropdown in toolbar"
                    />
                    <PropDoc
                      name="exportFileName"
                      type="string"
                      defaultValue="'export'"
                      description="Base filename for exported files (timestamp added automatically)"
                      example="'users-report'"
                    />
                    <PropDoc
                      name="exportConfig"
                      type="{ csv?: boolean; excel?: boolean; pdf?: boolean; print?: boolean }"
                      defaultValue="{ csv: true, excel: true, pdf: true, print: true }"
                      description="Enable specific export formats"
                      example="{ csv: true, excel: true, pdf: false, print: false }"
                    />
                  </div>
                </div>

                <Separator />

                {/* Selection Props */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Selection & Bulk Action Props</h3>
                  <div className="space-y-3">
                    <PropDoc
                      name="selectable"
                      type="boolean"
                      defaultValue="false"
                      description="Enable row selection checkboxes"
                    />
                    <PropDoc
                      name="onSelectionChange"
                      type="(rows: T[]) => void"
                      description="Callback fired when selection changes"
                      example="(rows) => setSelectedUsers(rows)"
                    />
                    <PropDoc
                      name="bulkActions"
                      type="BulkAction[]"
                      description="Array of bulk action button configs. Shown when rows are selected."
                      example={`[
  {
    label: 'Delete',
    icon: <Trash2 />,
    onClick: (rows) => deleteMultiple(rows),
    variant: 'destructive'
  }
]`}
                    />
                  </div>
                </div>

                <Separator />

                {/* UI Customization Props */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">UI Customization Props</h3>
                  <div className="space-y-3">
                    <PropDoc
                      name="viewerTitle"
                      type="string"
                      description="Title shown in row viewer dialog"
                      example="'User Details'"
                    />
                    <PropDoc
                      name="viewerSubtitle"
                      type="string"
                      description="Subtitle shown in row viewer dialog"
                      example="'Complete user information'"
                    />
                    <PropDoc
                      name="viewerFieldConfig"
                      type="Record<string, RowViewerFieldConfig>"
                      description="Custom field rendering config for row viewer"
                      example={`{
  email: {
    format: (value) => <a href={\`mailto:\${value}\`}>{value}</a>
  }
}`}
                    />
                    <PropDoc
                      name="customRowViewer"
                      type="(data: T) => ReactNode"
                      description="Completely custom row viewer component"
                      example="(data) => <CustomUserViewer user={data} />"
                    />
                    <PropDoc
                      name="customAddForm"
                      type="ReactNode"
                      description="Custom add form (replaces auto-generated form)"
                      example="<CustomUserAddForm onSubmit={handleCreate} />"
                    />
                    <PropDoc
                      name="customEditForm"
                      type="(data: T) => ReactNode"
                      description="Custom edit form (replaces auto-generated form)"
                      example="(data) => <CustomUserEditForm user={data} />"
                    />
                    <PropDoc
                      name="tableKey"
                      type="string"
                      description="Unique key for localStorage persistence (column visibility)"
                      example="'users-table'"
                    />
                    <PropDoc
                      name="rowIdField"
                      type="string"
                      defaultValue="'id'"
                      description="Field name to use as unique row identifier"
                      example="'userId'"
                    />
                    <PropDoc
                      name="onRowClick"
                      type="(row: T) => void"
                      description="Callback when table row is clicked"
                      example="(row) => router.push(\`/users/\${row.id}\`)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== CRUD ==================== */}
          <TabsContent value="crud" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CRUD Operations</CardTitle>
                <CardDescription>Complete guide to Create, Read, Update, Delete</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">1. Basic CRUD with Auto-Generated Forms</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`<DynamicServerTable
  // Required props
  initialData={data}
  columns={columns}
  fetchData={fetchUsers}

  // CRUD Configuration
  apiEndpoint="/api/users"
  formFields={[
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'John Doe'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'john@example.com'
    }
  ]}

  // Button visibility
  showAddButton={true}
  showEditButton={true}
  showDeleteButton={true}
  addButtonLabel="Add New User"
/>`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">2. Custom CRUD Handlers</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Override default behavior with custom handlers:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`// Define custom handlers
const handleCreate = async (data: Partial<User>) => {
  // Add custom validation
  if (!data.email?.includes('@company.com')) {
    throw new Error('Must use company email');
  }

  // Add custom logic
  const enrichedData = {
    ...data,
    createdBy: currentUser.id,
    department: determineDepartment(data.email)
  };

  // Call your custom API
  const result = await fetch('/api/users/create', {
    method: 'POST',
    body: JSON.stringify(enrichedData)
  });

  if (!result.ok) throw new Error('Failed to create');

  // Show custom notification
  toast.success(\`User \${data.name} created!\`);

  return result.json();
};

const handleUpdate = async (id: string, data: Partial<User>) => {
  // Add audit trail
  const auditData = {
    ...data,
    updatedBy: currentUser.id,
    updatedAt: new Date().toISOString()
  };

  return await customUpdateAPI(id, auditData);
};

const handleDelete = async (id: string) => {
  // Add custom confirmation
  const confirmed = await customConfirmDialog({
    title: 'Delete User',
    message: 'This action cannot be undone'
  });

  if (!confirmed) return;

  // Soft delete instead of hard delete
  await customSoftDelete(id);

  toast.success('User archived successfully');
};

// Use in component
<DynamicServerTable
  onCreateRecord={handleCreate}
  onUpdateRecord={handleUpdate}
  onDeleteRecord={handleDelete}
/>`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">3. Conditional CRUD Buttons</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Control button visibility based on user permissions:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`// Only show buttons if user has permission
<DynamicServerTable
  showAddButton={currentUser.role === 'admin'}
  showEditButton={currentUser.permissions.includes('edit')}
  showDeleteButton={currentUser.permissions.includes('delete')}

  // Custom labels based on context
  addButtonLabel={
    isTeamView ? 'Add Team Member' : 'Add User'
  }
/>`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== FORMS ==================== */}
          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Field Types</CardTitle>
                <CardDescription>All available form field types with complete examples</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Complete Form Fields Example</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`formFields: [
  // ========== TEXT INPUT ==========
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    placeholder: 'John',
  },

  // ========== EMAIL INPUT ==========
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'john@example.com',
    validation: (value) => {
      if (!value.includes('@')) return 'Invalid email';
      return true;
    }
  },

  // ========== PASSWORD INPUT ==========
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    placeholder: '********',
    validation: (value) => {
      if (value.length < 8) return 'Min 8 characters';
      if (!/[A-Z]/.test(value)) return 'Need uppercase';
      if (!/[0-9]/.test(value)) return 'Need number';
      return true;
    }
  },

  // ========== NUMBER INPUT ==========
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    required: false,
    placeholder: '25',
    validation: (value) => {
      if (value < 18) return 'Must be 18+';
      if (value > 120) return 'Invalid age';
      return true;
    }
  },

  // ========== TEXTAREA ==========
  {
    name: 'bio',
    label: 'Biography',
    type: 'textarea',
    required: false,
    placeholder: 'Tell us about yourself...',
    rows: 4,
  },

  // ========== SELECT DROPDOWN ==========
  {
    name: 'role',
    label: 'User Role',
    type: 'select',
    required: true,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Manager', value: 'manager' },
      { label: 'User', value: 'user' },
      { label: 'Guest', value: 'guest' }
    ]
  },

  // ========== MULTISELECT ==========
  {
    name: 'departments',
    label: 'Departments',
    type: 'multiselect',
    required: false,
    options: [
      { label: 'Engineering', value: 'eng' },
      { label: 'Sales', value: 'sales' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Support', value: 'support' }
    ]
  },

  // ========== DATE INPUT ==========
  {
    name: 'birthDate',
    label: 'Date of Birth',
    type: 'date',
    required: false,
  },

  // ========== CHECKBOX ==========
  {
    name: 'isActive',
    label: 'Active Account',
    type: 'checkbox',
    required: false,
    defaultValue: true
  },

  // ========== PHONE INPUT ==========
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    required: false,
    placeholder: '+1 (555) 123-4567',
    validation: (value) => {
      if (!/^\+?[\d\s()-]+$/.test(value)) return 'Invalid phone';
      return true;
    }
  },

  // ========== URL INPUT ==========
  {
    name: 'website',
    label: 'Website',
    type: 'url',
    required: false,
    placeholder: 'https://example.com',
    validation: (value) => {
      if (!value.startsWith('http')) return 'Must start with http';
      return true;
    }
  }
]`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Form Field Properties</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        name
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Field identifier (required). Must match data property.
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">name: 'email'</code>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        label
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Display label shown above field (required).
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">label: 'Email Address'</code>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        type
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Input type (required): text, email, password, number, textarea, select, multiselect, date, checkbox, tel, url
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        required
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Whether field is required. Shows red asterisk.
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">required: true</code>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        placeholder
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Placeholder text shown when empty.
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">placeholder: 'Enter email...'</code>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        defaultValue
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Initial value for field.
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">defaultValue: true</code>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        options
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Options for select/multiselect fields.
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">{'options: [{ label: "Admin", value: "admin" }]'}</code>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        validation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Custom validation function.
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">{'validation: (val) => val.length > 5 || "Too short"'}</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== SEARCH ==================== */}
          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Configuration</CardTitle>
                <CardDescription>Multi-field search with automatic debouncing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Basic Search Setup</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`<DynamicServerTable
  // Enable search
  searchable={true}

  // Custom placeholder
  searchPlaceholder="Search users by name, email, or phone..."

  // Fields to search in (searches all if not specified)
  searchFields={['name', 'email', 'phone', 'company', 'department']}
/>`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Search Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">Multi-field search</strong>
                        <p className="text-sm text-muted-foreground">
                          Searches across all specified fields simultaneously. Returns results matching ANY field.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">Automatic debouncing</strong>
                        <p className="text-sm text-muted-foreground">
                          Waits 500ms after user stops typing before searching. Prevents excessive API calls.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">Clear button</strong>
                        <p className="text-sm text-muted-foreground">
                          X button appears when search has text. Clears search and refreshes data.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">State persistence</strong>
                        <p className="text-sm text-muted-foreground">
                          Search query is maintained when navigating between pages or applying filters.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">Case-insensitive</strong>
                        <p className="text-sm text-muted-foreground">
                          Searches are case-insensitive by default. "john" matches "John", "JOHN", etc.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">Partial matching</strong>
                        <p className="text-sm text-muted-foreground">
                          Finds partial matches. "joh" matches "John", "Johnson", etc.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Search Examples</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">Example 1: Simple Search</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <code>searchable={'{true}'}</code>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Enables search across all columns
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">Example 2: Specific Fields</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <code>searchFields={'{["name", "email"]}'}</code>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Only searches name and email fields
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">Example 3: Custom Placeholder</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <code>searchPlaceholder="Find a customer..."</code>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Helpful hint for users about what they can search
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== FILTERS ==================== */}
          <TabsContent value="filters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Filtering</CardTitle>
                <CardDescription>Select and multiselect filters with active badges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Complete Filter Examples</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`filters={[
  // ========== SINGLE SELECT FILTER ==========
  {
    field: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { label: 'All Departments', value: '' },  // Empty value = no filter
      { label: 'Engineering', value: 'engineering' },
      { label: 'Sales', value: 'sales' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Support', value: 'support' }
    ]
  },

  // ========== MULTISELECT FILTER ==========
  {
    field: 'status',
    label: 'Status',
    type: 'multiselect',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
      { label: 'Suspended', value: 'suspended' }
    ]
  },

  // ========== ROLE FILTER ==========
  {
    field: 'role',
    label: 'User Role',
    type: 'multiselect',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Manager', value: 'manager' },
      { label: 'User', value: 'user' },
      { label: 'Guest', value: 'guest' }
    ]
  },

  // ========== BOOLEAN FILTER ==========
  {
    field: 'isVerified',
    label: 'Verification',
    type: 'select',
    options: [
      { label: 'All', value: '' },
      { label: 'Verified Only', value: 'true' },
      { label: 'Unverified Only', value: 'false' }
    ]
  },

  // ========== DATE RANGE FILTER ==========
  {
    field: 'createdAt',
    label: 'Created',
    type: 'select',
    options: [
      { label: 'All Time', value: '' },
      { label: 'Today', value: 'today' },
      { label: 'This Week', value: 'week' },
      { label: 'This Month', value: 'month' },
      { label: 'This Year', value: 'year' }
    ]
  }
]}`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Filter Types Explained</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-blue-600" />
                        Single Select
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        User can select ONE option from dropdown. Previous selection is replaced.
                      </p>
                      <div className="bg-muted p-2 rounded text-xs">
                        <code>type: 'select'</code>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Use case:</strong> Department, Priority, Category
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-purple-600" />
                        Multi-Select
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        User can select MULTIPLE options. Results match ANY selected value (OR logic).
                      </p>
                      <div className="bg-muted p-2 rounded text-xs">
                        <code>type: 'multiselect'</code>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Use case:</strong> Status, Role, Tags
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Filter Behavior</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Badge variant="outline" className="flex-shrink-0 mt-0.5">1</Badge>
                      <div>
                        <strong className="block">Active filter badges</strong>
                        <p className="text-sm text-muted-foreground">
                          Selected filters appear as badges above the table with X button to remove
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Badge variant="outline" className="flex-shrink-0 mt-0.5">2</Badge>
                      <div>
                        <strong className="block">Multiple filters combine with AND</strong>
                        <p className="text-sm text-muted-foreground">
                          If you select "Status: Active" AND "Role: Admin", results must match BOTH
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Badge variant="outline" className="flex-shrink-0 mt-0.5">3</Badge>
                      <div>
                        <strong className="block">Multiselect uses OR within same filter</strong>
                        <p className="text-sm text-muted-foreground">
                          Selecting "Active" and "Pending" in Status filter shows items that are Active OR Pending
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Badge variant="outline" className="flex-shrink-0 mt-0.5">4</Badge>
                      <div>
                        <strong className="block">Filters persist during pagination</strong>
                        <p className="text-sm text-muted-foreground">
                          Applied filters remain active when moving between pages
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Badge variant="outline" className="flex-shrink-0 mt-0.5">5</Badge>
                      <div>
                        <strong className="block">Works with search</strong>
                        <p className="text-sm text-muted-foreground">
                          Can combine search query with filters for precise results
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Real-World Filter Examples</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">User Management Table</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <pre>
{`filters={[
  { field: 'status', label: 'Status', type: 'multiselect',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  },
  { field: 'role', label: 'Role', type: 'multiselect',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]
  }
]}`}
                        </pre>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">Booking Management Table</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <pre>
{`filters={[
  { field: 'status', label: 'Booking Status', type: 'multiselect',
    options: [
      { label: 'Confirmed', value: 'confirmed' },
      { label: 'Pending', value: 'pending' },
      { label: 'Cancelled', value: 'cancelled' }
    ]
  },
  { field: 'paymentStatus', label: 'Payment', type: 'select',
    options: [
      { label: 'All', value: '' },
      { label: 'Paid', value: 'paid' },
      { label: 'Unpaid', value: 'unpaid' }
    ]
  }
]}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== BULK ACTIONS ==================== */}
          <TabsContent value="bulk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Actions</CardTitle>
                <CardDescription>Perform actions on multiple selected rows with ALL button variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Complete Bulk Actions Example</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`// Enable selection and define bulk actions
<DynamicServerTable
  // Enable row selection checkboxes
  selectable={true}

  // Track selection changes
  onSelectionChange={(selectedRows) => {
    console.log('Selected:', selectedRows);
    setSelectedItems(selectedRows);
  }}

  // Define bulk action buttons (ALL VARIANTS)
  bulkActions={[
    // ========== DEFAULT VARIANT (Blue) ==========
    {
      label: 'Send Email',
      icon: <Mail className="h-4 w-4" />,
      onClick: (selectedRows) => {
        console.log('Emailing:', selectedRows);
        sendBulkEmail(selectedRows);
      },
      variant: 'default'  // Blue button
    },

    // ========== SECONDARY VARIANT (Gray) ==========
    {
      label: 'Export Selected',
      icon: <Download className="h-4 w-4" />,
      onClick: (selectedRows) => {
        exportToCSV(selectedRows);
      },
      variant: 'secondary'  // Gray button
    },

    // ========== OUTLINE VARIANT (Border only) ==========
    {
      label: 'Archive',
      icon: <Archive className="h-4 w-4" />,
      onClick: (selectedRows) => {
        archiveMultiple(selectedRows);
      },
      variant: 'outline'  // Border button
    },

    // ========== GHOST VARIANT (Transparent) ==========
    {
      label: 'Print',
      icon: <Printer className="h-4 w-4" />,
      onClick: (selectedRows) => {
        printSelected(selectedRows);
      },
      variant: 'ghost'  // Transparent button
    },

    // ========== DESTRUCTIVE VARIANT (Red) ==========
    {
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: async (selectedRows) => {
        // Show confirmation
        const confirmed = await confirm(
          \`Delete \${selectedRows.length} items?\`
        );

        if (confirmed) {
          await deleteMultiple(selectedRows);
          toast.success(\`Deleted \${selectedRows.length} items\`);
        }
      },
      variant: 'destructive'  // Red button
    },

    // ========== LINK VARIANT (Underlined) ==========
    {
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: (selectedRows) => {
        if (selectedRows.length === 1) {
          router.push(\`/details/\${selectedRows[0].id}\`);
        } else {
          toast.error('Select only one item');
        }
      },
      variant: 'link'  // Link-style button
    }
  ]}
/>`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Button Variants Visual Guide</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded bg-primary"></div>
                        <Badge>default</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Primary actions:</strong> Send Email, Create Report, Assign To
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">variant: 'default'</code>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded bg-secondary"></div>
                        <Badge>secondary</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Secondary actions:</strong> Export, Download, Copy
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">variant: 'secondary'</code>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded border-2"></div>
                        <Badge>outline</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Low-priority:</strong> Archive, Move, Tag
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">variant: 'outline'</code>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded bg-gray-100"></div>
                        <Badge>ghost</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Minimal:</strong> Print, Refresh, More Options
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">variant: 'ghost'</code>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded bg-destructive"></div>
                        <Badge variant="destructive">destructive</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Dangerous:</strong> Delete, Remove, Disable
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">variant: 'destructive'</code>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded underline"></div>
                        <Badge>link</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Navigation:</strong> View All, Open, Navigate
                      </p>
                      <code className="text-xs bg-muted px-1 rounded">variant: 'link'</code>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Bulk Action Properties</h3>
                  <div className="space-y-3">
                    <PropDoc
                      name="label"
                      type="string"
                      required
                      description="Button text displayed to user"
                      example="'Send Email' or 'Delete Selected'"
                    />
                    <PropDoc
                      name="icon"
                      type="ReactNode"
                      description="Icon component shown before label"
                      example="<Mail className='h-4 w-4' />"
                    />
                    <PropDoc
                      name="onClick"
                      type="(selectedRows: T[]) => void"
                      required
                      description="Function called when button clicked. Receives array of selected rows."
                      example="(rows) => deleteMultiple(rows)"
                    />
                    <PropDoc
                      name="variant"
                      type="'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'"
                      defaultValue="'default'"
                      description="Button style variant"
                      example="'destructive'"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Advanced Bulk Action Examples</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">Bulk Status Change</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <pre>
{`{
  label: 'Mark as Active',
  icon: <CheckCircle className="h-4 w-4" />,
  onClick: async (rows) => {
    await Promise.all(
      rows.map(row => updateStatus(row.id, 'active'))
    );
    toast.success(\`Updated \${rows.length} users\`);
    refreshTable();
  },
  variant: 'default'
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">Conditional Bulk Action</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <pre>
{`{
  label: 'Send Notification',
  icon: <Bell className="h-4 w-4" />,
  onClick: (rows) => {
    // Filter rows
    const activeUsers = rows.filter(r => r.status === 'active');

    if (activeUsers.length === 0) {
      toast.error('No active users selected');
      return;
    }

    sendNotifications(activeUsers);
    toast.success(\`Sent to \${activeUsers.length} users\`);
  },
  variant: 'default'
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">Bulk Action with Progress</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <pre>
{`{
  label: 'Process All',
  icon: <Zap className="h-4 w-4" />,
  onClick: async (rows) => {
    let processed = 0;

    for (const row of rows) {
      await processItem(row);
      processed++;

      // Update progress
      toast.loading(\`Processing \${processed}/\${rows.length}\`);
    }

    toast.success('All items processed!');
  },
  variant: 'default'
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== EXPORT ==================== */}
          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>Export to CSV, Excel, PDF, or Print with complete control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Complete Export Configuration</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`<DynamicServerTable
  // Enable export dropdown
  exportable={true}

  // Custom filename (timestamp added automatically)
  exportFileName="users-report"
  // Results in: users-report-2024-11-18-14-30-45.csv

  // Enable specific formats (all true by default)
  exportConfig={{
    csv: true,      // Export to CSV
    excel: true,    // Export to XLSX
    pdf: true,      // Export to PDF
    print: true     // Open print dialog
  }}
/>`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Export Format Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold">CSV Export</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Plain text format with comma-separated values
                      </p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>✓ Compatible with Excel, Google Sheets</p>
                        <p>✓ Opens in any text editor</p>
                        <p>✓ Small file size</p>
                        <p>✓ UTF-8 encoded (supports emojis)</p>
                      </div>
                      <code className="text-xs bg-muted px-1 rounded block mt-2">
                        users-report-2024-11-18.csv
                      </code>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Download className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold">Excel Export</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Native Microsoft Excel format with formatting
                      </p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>✓ Opens directly in Excel</p>
                        <p>✓ Preserves data types</p>
                        <p>✓ Formatted numbers</p>
                        <p>✓ Column widths auto-sized</p>
                      </div>
                      <code className="text-xs bg-muted px-1 rounded block mt-2">
                        users-report-2024-11-18.xlsx
                      </code>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-red-600" />
                        <h4 className="font-semibold">PDF Export</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Professional PDF document with table formatting
                      </p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>✓ Professional appearance</p>
                        <p>✓ Paginated automatically</p>
                        <p>✓ Header on each page</p>
                        <p>✓ Ready for printing/sharing</p>
                      </div>
                      <code className="text-xs bg-muted px-1 rounded block mt-2">
                        users-report-2024-11-18.pdf
                      </code>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Printer className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold">Print</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Opens browser print dialog for direct printing
                      </p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>✓ Print directly or save as PDF</p>
                        <p>✓ Optimized layout</p>
                        <p>✓ Page breaks handled</p>
                        <p>✓ No extra files created</p>
                      </div>
                      <code className="text-xs bg-muted px-1 rounded block mt-2">
                        Opens: Browser Print Dialog
                      </code>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Export Behavior</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">Exports current view only</strong>
                        <p className="text-sm text-muted-foreground">
                          Only visible data is exported. If you have search/filters applied, only matching results are exported.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">All columns included</strong>
                        <p className="text-sm text-muted-foreground">
                          All table columns are included in export, even if hidden via column visibility toggle.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">Formatted values</strong>
                        <p className="text-sm text-muted-foreground">
                          Exports formatted values (e.g., "₹1,234" instead of "1234", "Active" badge exports as "Active")
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">Automatic timestamps</strong>
                        <p className="text-sm text-muted-foreground">
                          Filename includes date and time (users-report-2024-11-18-14-30-45.xlsx)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block">Client-side processing</strong>
                        <p className="text-sm text-muted-foreground">
                          Export happens in browser. No server-side processing required.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Export Configuration Examples</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">CSV and Excel Only</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <pre>
{`exportable={true}
exportFileName="users"
exportConfig={{
  csv: true,
  excel: true,
  pdf: false,
  print: false
}}`}
                        </pre>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Good for data analysis use cases
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">PDF and Print Only</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <pre>
{`exportable={true}
exportFileName="invoice-report"
exportConfig={{
  csv: false,
  excel: false,
  pdf: true,
  print: true
}}`}
                        </pre>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Good for documents and reports
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">All Formats Enabled</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <pre>
{`exportable={true}
exportFileName="complete-data"
exportConfig={{
  csv: true,
  excel: true,
  pdf: true,
  print: true
}}`}
                        </pre>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Maximum flexibility for users
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== CUSTOM ==================== */}
          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Components</CardTitle>
                <CardDescription>Complete customization with custom forms, viewers, and field configs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">1. Custom Row Viewer</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create a completely custom detail view for rows:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`<DynamicServerTable
  customRowViewer={(user) => (
    <div className="space-y-6 p-4">
      {/* Header with Avatar */}
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge>{user.role}</Badge>
            <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
              {user.status}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-muted-foreground">Phone</label>
          <p className="font-medium">
            <a href={\`tel:\${user.phone}\`} className="hover:underline">
              {user.phone}
            </a>
          </p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Department</label>
          <p className="font-medium">{user.department}</p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Joined</label>
          <p className="font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Last Login</label>
          <p className="font-medium">
            {formatDistanceToNow(new Date(user.lastLogin))} ago
          </p>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={() => sendEmail(user)}>
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
        <Button variant="outline" onClick={() => call(user)}>
          <Phone className="mr-2 h-4 w-4" />
          Call
        </Button>
        <Button variant="outline" onClick={() => viewProfile(user)}>
          <Eye className="mr-2 h-4 w-4" />
          Full Profile
        </Button>
      </div>

      {/* Activity Timeline */}
      <div>
        <h3 className="font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {user.recentActivity.map((activity, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp))} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
/>`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">2. Custom Add Form</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`<DynamicServerTable
  customAddForm={
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-2xl font-bold">Create New User</h2>
        <p className="text-muted-foreground">
          Fill out the form to add a new team member
        </p>
      </div>

      <Separator />

      {/* Personal Info Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Personal Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name *</Label>
            <Input placeholder="John" {...register('firstName')} />
          </div>
          <div>
            <Label>Last Name *</Label>
            <Input placeholder="Doe" {...register('lastName')} />
          </div>
        </div>

        <div>
          <Label>Email Address *</Label>
          <Input type="email" placeholder="john@company.com" {...register('email')} />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input type="tel" placeholder="+1 (555) 123-4567" {...register('phone')} />
        </div>
      </div>

      <Separator />

      {/* Work Info Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Work Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Department *</Label>
            <Select {...register('department')}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Role *</Label>
            <Select {...register('role')}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Start Date *</Label>
          <Input type="date" {...register('startDate')} />
        </div>
      </div>

      <Separator />

      {/* Permissions Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Permissions</h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="canEdit" {...register('canEdit')} />
            <Label htmlFor="canEdit" className="cursor-pointer">
              Can edit data
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="canDelete" {...register('canDelete')} />
            <Label htmlFor="canDelete" className="cursor-pointer">
              Can delete records
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="canExport" {...register('canExport')} />
            <Label htmlFor="canExport" className="cursor-pointer">
              Can export data
            </Label>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>
    </div>
  }
/>`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">3. Custom Edit Form</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`<DynamicServerTable
  customEditForm={(user) => (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">Edit: {user.name}</h2>
          <p className="text-sm text-muted-foreground">
            Last updated {formatDistanceToNow(new Date(user.updatedAt))} ago
          </p>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input defaultValue={user.name} {...register('name')} />
          </div>

          <div>
            <Label>Email</Label>
            <Input defaultValue={user.email} {...register('email')} />
          </div>

          <div>
            <Label>Phone</Label>
            <Input defaultValue={user.phone} {...register('phone')} />
          </div>
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <div>
            <Label>Department</Label>
            <Select defaultValue={user.department}>
              {/* Options */}
            </Select>
          </div>

          <div>
            <Label>Role</Label>
            <Select defaultValue={user.role}>
              {/* Options */}
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <div className="flex items-center gap-2">
              <Switch defaultChecked={user.status === 'active'} />
              <span className="text-sm">
                {user.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          {/* Permission checkboxes */}
        </TabsContent>
      </Tabs>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Changes will be logged in the audit trail
        </AlertDescription>
      </Alert>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )}
/>`}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">4. Viewer Field Config (Simpler Alternative)</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you don't need a fully custom viewer, use viewerFieldConfig for per-field customization:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`<DynamicServerTable
  viewerFieldConfig={{
    // Hide fields
    id: { hidden: true },
    password: { hidden: true },
    internalNotes: { hidden: true },

    // Custom labels
    createdAt: {
      label: 'Account Created',
      format: (value) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    // Clickable email
    email: {
      format: (value) => (
        <a
          href={\`mailto:\${value}\`}
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          {value}
        </a>
      )
    },

    // Clickable phone
    phone: {
      format: (value) => (
        <a
          href={\`tel:\${value}\`}
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <Phone className="h-4 w-4" />
          {value}
        </a>
      )
    },

    // Formatted money
    salary: {
      label: 'Annual Salary',
      format: (value) => (
        <span className="text-2xl font-bold text-green-600">
          ₹{value.toLocaleString('en-IN')}
        </span>
      )
    },

    // Badge for status
    status: {
      format: (value) => {
        const variants = {
          active: 'default',
          inactive: 'secondary',
          suspended: 'destructive'
        };
        return (
          <Badge variant={variants[value] || 'outline'}>
            {value}
          </Badge>
        );
      }
    },

    // Progress bar
    completionRate: {
      label: 'Profile Completion',
      format: (value) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{value}%</span>
          </div>
          <Progress value={value} className="h-2" />
        </div>
      )
    },

    // Array as list
    tags: {
      format: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.map((tag, i) => (
            <Badge key={i} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )
    },

    // Boolean as icon
    isVerified: {
      label: 'Verified',
      format: (value) => (
        value ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )
      )
    }
  }}
/>`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Rocket className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Ready to Build Amazing Tables!</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This documentation covers EVERY single feature, prop, and configuration option available in DynamicServerTable.
                Use the examples as templates and customize them for your needs.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <Badge variant="outline" className="text-sm py-1">
                  <Code className="h-3 w-3 mr-1" />
                  TypeScript First
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  <Rocket className="h-3 w-3 mr-1" />
                  Production Ready
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  <Smartphone className="h-3 w-3 mr-1" />
                  Mobile Responsive
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  <Zap className="h-3 w-3 mr-1" />
                  Blazing Fast
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                Check out the <strong>bookings</strong> and <strong>flights</strong> tables for real-world implementations!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for prop documentation
function PropDoc({
  name,
  type,
  required = false,
  defaultValue,
  description,
  example,
}: {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: string;
  example?: string;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{name}</code>
          {required && <Badge variant="destructive" className="text-xs">Required</Badge>}
        </div>
        <code className="text-xs text-muted-foreground whitespace-nowrap">{type}</code>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      {defaultValue && (
        <p className="text-xs text-muted-foreground">
          Default: <code className="bg-muted px-1 rounded">{defaultValue}</code>
        </p>
      )}
      {example && (
        <div className="mt-2">
          <p className="text-xs font-semibold mb-1">Example:</p>
          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
            {example}
          </pre>
        </div>
      )}
    </div>
  );
}
