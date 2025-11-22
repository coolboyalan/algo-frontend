import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  Code,
  Rocket,
  Settings,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Edit,
  Table as TableIcon,
  Smartphone,
  Keyboard,
  Zap,
  Database,
  FileText,
  Mail,
  Send,
  Archive,
  Bell,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Printer,
  Globe,
  History,
  Link2,
  Mouse,
  Layers,
  Phone,
  Calendar,
  User,
  Building,
  ArrowRight,
  Check,
  Star,
  TrendingUp,
  Package,
  Lock,
  Lightbulb,
  Copy,
  MessageSquare,
} from "lucide-react";

export default function DocsPage() {
  return (
    <div className="px-6 pb-6 max-w-[1600px] mx-auto">
      <div className="space-y-6">
        {/* ==================== HEADER ==================== */}
        <div className="pt-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl">
                <TableIcon className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                DynamicServerTable v2.0
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Latest Release
                </Badge>
                <Badge variant="outline" className="border-blue-300">
                  <Code className="h-3 w-3 mr-1" />
                  TypeScript First
                </Badge>
                <Badge variant="outline" className="border-purple-300">
                  <Zap className="h-3 w-3 mr-1" />
                  Production Ready
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-lg max-w-5xl leading-relaxed">
            The most powerful, feature-complete table component for Next.js 14+.
            Built with <strong>TypeScript</strong>,
            <strong> TanStack Table</strong>, and <strong>Shadcn UI</strong>.
            Includes complete CRUD operations, advanced filtering, URL state
            management, browser navigation support, mobile responsiveness, and
            50+ customization options.
          </p>
        </div>

        {/* ==================== WHAT'S NEW BANNER ==================== */}
        <Alert className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-2 border-blue-300 dark:border-blue-700 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <Rocket className="h-5 w-5 text-blue-600 animate-bounce" />
          <AlertDescription className="ml-2">
            <div className="flex flex-col gap-1">
              <strong className="text-blue-700 dark:text-blue-400 text-base flex items-center gap-2">
                🎉 What's New in v2.0
                <Badge className="bg-green-600 border-0">5 Major Updates</Badge>
              </strong>
              <span className="text-foreground text-sm">
                <strong>URL State Management</strong> •{" "}
                <strong>Browser Navigation</strong> •
                <strong> Dialog URL Sync</strong> •{" "}
                <strong>Enhanced Pagination</strong> •
                <strong> Performance Fixes</strong>
              </span>
            </div>
          </AlertDescription>
        </Alert>

        {/* ==================== QUICK STATS ==================== */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-blue-600 hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Configuration Props
              </CardTitle>
              <Settings className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">50+</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Every aspect customizable
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600 hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Built-in Features
              </CardTitle>
              <Zap className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">25+</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Package className="h-3 w-3" />
                Ready-to-use functionality
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600 hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Form Field Types
              </CardTitle>
              <FileText className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600">10+</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Keyboard className="h-3 w-3" />
                Auto-generated inputs
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-600 hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Export Formats
              </CardTitle>
              <Download className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600">4</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Check className="h-3 w-3" />
                CSV, Excel, PDF, Print
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ==================== MAIN DOCUMENTATION TABS ==================== */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10 h-auto p-1 bg-muted/50">
            {[
              { value: "overview", icon: BookOpen, label: "Overview" },
              { value: "features", icon: Zap, label: "Features" },
              { value: "props", icon: Settings, label: "Props API" },
              { value: "crud", icon: Edit, label: "CRUD" },
              { value: "forms", icon: FileText, label: "Forms" },
              { value: "search", icon: Search, label: "Search" },
              { value: "filters", icon: Filter, label: "Filters" },
              { value: "bulk", icon: Layers, label: "Bulk Actions" },
              { value: "export", icon: Download, label: "Export" },
              { value: "custom", icon: Code, label: "Advanced" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col gap-1.5 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-xs font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ==================== TAB: OVERVIEW ==================== */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Complete Getting Started Guide
                </CardTitle>
                <CardDescription className="text-base">
                  Everything you need to implement DynamicServerTable in your
                  Next.js project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Installation */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    Step 1: Installation & Dependencies
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Install required packages:
                      </p>
                      <pre className="text-sm bg-muted p-4 rounded-lg border overflow-x-auto">
                        {`npm install @tanstack/react-table
npm install xlsx jspdf jspdf-autotable
npm install lucide-react sonner`}
                      </pre>
                    </div>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Note:</strong> Make sure you have Shadcn UI
                        components installed (Card, Button, Table, Dialog,
                        Select, Alert, etc.)
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <Separator />

                {/* Minimal Example */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Code className="h-5 w-5 text-green-600" />
                    Step 2: Basic Implementation (Minimal)
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      The simplest possible implementation with default
                      settings:
                    </p>
                    <div className="bg-muted p-4 rounded-lg border">
                      <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                        {`// app/users/page.tsx
import { DynamicServerTable } from '@/components/table/dynamic-server-table';
import { ColumnDef } from '@tanstack/react-table';
import { fetchTableData } from '@/app/actions/table-data';

type User = {
  id: string;
  name: string;
  email: string;
  status: string;
};

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: 'Actions' },
];

export default async function UsersPage() {
  const initialData = await fetchTableData('/api/users', {
    limit: 10
  });

  return (
    <DynamicServerTable
      initialData={initialData}
      columns={columns}
      fetchData={async (params) => {
        'use server';
        return fetchTableData('/api/users', params);
      }}
      tableKey="users-table"
    />
  );
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Full Featured Example */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-orange-600" />
                    Step 3: Production-Ready Implementation
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Full example with all major features enabled:
                    </p>
                    <div className="bg-muted p-4 rounded-lg border">
                      <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                        {`// app/bookings/page.tsx
import { DynamicServerTable } from '@/components/table/dynamic-server-table';
import { ColumnDef } from '@tanstack/react-table';
import { fetchTableData } from '@/app/actions/table-data';
import { FormFieldConfig } from '@/components/forms/auto-form-generator';
import { Mail, XCircle } from 'lucide-react';

type Booking = {
  id: string;
  bookingId: string;
  passengerName: string;
  email: string;
  phone: string;
  flightNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
};

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'bookingId',
    header: 'Booking ID',
    enableSorting: true
  },
  { accessorKey: 'passengerName', header: 'Passenger' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'flightNumber', header: 'Flight' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const colors = {
        confirmed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800',
      };
      return (
        <span className={\`px-2 py-1 rounded text-xs font-medium \${colors[status]}\`}>
          {status.toUpperCase()}
        </span>
      );
    }
  },
  { id: 'actions', header: 'Actions' },
];

const formFields: FormFieldConfig[] = [
  {
    name: 'passengerName',
    label: 'Passenger Name',
    type: 'text',
    required: true,
    placeholder: 'Enter full name',
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: (value) => {
      if (!value.includes('@')) return 'Invalid email';
    },
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    required: true,
    placeholder: '+1 (555) 000-0000',
  },
  {
    name: 'flightNumber',
    label: 'Flight Number',
    type: 'text',
    required: true,
    placeholder: 'e.g., AA123',
  },
  {
    name: 'status',
    label: 'Booking Status',
    type: 'select',
    options: [
      { label: 'Confirmed', value: 'confirmed' },
      { label: 'Pending', value: 'pending' },
      { label: 'Cancelled', value: 'cancelled' },
    ],
    required: true,
  },
];

export default async function BookingsPage() {
  const initialData = await fetchTableData('/api/bookings', {
    limit: 25,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <p className="text-muted-foreground">
          Manage all your flight bookings in one place
        </p>
      </div>

      <DynamicServerTable<Booking>
        // Core Data Props
        initialData={initialData}
        columns={columns}
        fetchData={async (params) => {
          'use server';
          return fetchTableData('/api/bookings', params);
        }}
        tableKey="bookings-table"
        rowIdField="id"

        // CRUD Configuration
        apiEndpoint="/api/bookings"
        formFields={formFields}
        showAddButton={true}
        addButtonLabel="New Booking"
        showEditButton={true}
        showDeleteButton={true}

        // Search Configuration
        searchable={true}
        searchPlaceholder="Search by name, email, phone, or booking ID..."
        searchFields={['passengerName', 'bookingId', 'email', 'phone']}

        // Filters
        filters={[
          {
            field: 'status',
            label: 'Status',
            type: 'multiselect',
            options: [
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Pending', value: 'pending' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
          {
            field: 'flightNumber',
            label: 'Flight',
            type: 'select',
            options: [
              { label: 'Flight AA123', value: 'AA123' },
              { label: 'Flight BA456', value: 'BA456' },
              { label: 'Flight UA789', value: 'UA789' },
            ],
          },
        ]}

        // Pagination
        pageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
        defaultSortBy="createdAt"
        defaultSortOrder="desc"

        // Selection & Bulk Actions
        selectable={true}
        onSelectionChange={(rows) => {
          console.log('Selected bookings:', rows.length);
        }}
        bulkActions={[
          {
            label: 'Send Confirmation Email',
            icon: <Mail className="h-4 w-4" />,
            onClick: (selectedRows) => {
              console.log('Sending emails to:', selectedRows);
              // Your bulk email logic
            },
            variant: 'default',
          },
          {
            label: 'Cancel Bookings',
            icon: <XCircle className="h-4 w-4" />,
            onClick: (selectedRows) => {
              if (confirm(\`Cancel \${selectedRows.length} bookings?\`)) {
                // Your bulk cancel logic
              }
            },
            variant: 'destructive',
          },
        ]}

        // Export Configuration
        exportable={true}
        exportFileName="bookings-export"
        exportConfig={{
          csv: true,
          excel: true,
          pdf: true,
          print: true,
        }}

        // Row Viewer Configuration
        viewerTitle="Booking Details"
        viewerSubtitle="Complete booking information"
        viewerFieldConfig={{
          createdAt: {
            label: 'Booking Date',
            format: (value) => new Date(value).toLocaleString(),
          },
          email: {
            label: 'Contact Email',
          },
          phone: {
            label: 'Contact Phone',
          },
        }}
      />
    </div>
  );
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Key Concepts */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Step 4: Understanding Key Concepts
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Database className="h-4 w-4 text-blue-600" />
                          Server-Side Data Fetching
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          Data is fetched on the server using Next.js Server
                          Actions. The{" "}
                          <code className="bg-muted px-1 rounded">
                            fetchData
                          </code>{" "}
                          prop receives parameters (page, search, filters) and
                          returns data from your API.
                        </p>
                        <pre className="text-xs bg-muted p-2 rounded">
                          {`fetchData={async (params) => {
  'use server';
  return fetchTableData('/api/users', params);
}}`}
                        </pre>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Globe className="h-4 w-4 text-purple-600" />
                          URL State Management
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">
                            NEW in v2.0:
                          </strong>{" "}
                          All table state (page, search, filters, dialogs) is
                          synced with the URL. This enables:
                        </p>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>✓ Shareable links with filters</li>
                          <li>✓ Browser back/forward navigation</li>
                          <li>✓ Bookmark specific table states</li>
                          <li>✓ Deep linking to dialogs</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <History className="h-4 w-4 text-green-600" />
                          Cursor-Based Pagination
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          Uses cursor-based pagination for efficient performance
                          with large datasets. Cursor history is maintained for
                          proper previous/next navigation.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong className="text-foreground">
                            Enhanced in v2.0:
                          </strong>{" "}
                          Fixed previous page navigation with proper cursor
                          tracking.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Edit className="h-4 w-4 text-orange-600" />
                          Auto-Generated CRUD
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          Forms are automatically generated from your{" "}
                          <code className="bg-muted px-1 rounded">
                            formFields
                          </code>{" "}
                          configuration. Or provide custom forms using props:
                        </p>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>
                            •{" "}
                            <code className="bg-muted px-1 rounded">
                              customAddForm
                            </code>
                          </li>
                          <li>
                            •{" "}
                            <code className="bg-muted px-1 rounded">
                              customEditForm
                            </code>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Next Steps */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                    Next Steps
                  </h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Card className="border-l-4 border-l-blue-600">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-5 w-5 text-blue-600" />
                          <strong>Explore Features</strong>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Check the <strong>Features</strong> tab to see all 25+
                          built-in features
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-600">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="h-5 w-5 text-purple-600" />
                          <strong>Browse Props</strong>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          See the <strong>Props API</strong> tab for all 50+
                          configuration options
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-600">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="h-5 w-5 text-green-600" />
                          <strong>View Examples</strong>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Check <strong>Bookings</strong> and{" "}
                          <strong>Flights</strong> pages for live demos
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== TAB: FEATURES ==================== */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Zap className="h-6 w-6 text-yellow-600" />
                  Complete Feature Reference
                </CardTitle>
                <CardDescription className="text-base">
                  Every feature included in DynamicServerTable v2.0 with
                  detailed explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* URL State Management */}
                  <Card className="border-l-4 border-l-blue-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Globe className="h-5 w-5 text-blue-600" />
                          URL State Management
                        </CardTitle>
                        <Badge className="bg-blue-600 border-0 text-xs">
                          NEW
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "All state synced to URL parameters",
                        "Shareable table links with filters",
                        "Deep linkable table states",
                        "Clean URLs without clutter",
                        "Automatic state restoration",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Browser Navigation */}
                  <Card className="border-l-4 border-l-purple-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <History className="h-5 w-5 text-purple-600" />
                          Browser Navigation
                        </CardTitle>
                        <Badge className="bg-purple-600 border-0 text-xs">
                          NEW
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "Back/Forward button support",
                        "History entries for each page",
                        "Proper state restoration on nav",
                        "Dialog closes on browser back",
                        "Search & filter persistence",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Cursor Pagination */}
                  <Card className="border-l-4 border-l-green-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Mouse className="h-5 w-5 text-green-600" />
                          Cursor Pagination
                        </CardTitle>
                        <Badge className="bg-green-600 border-0 text-xs">
                          ENHANCED
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "Efficient for large datasets",
                        "Cursor history tracking",
                        "Previous page navigation fixed",
                        "Customizable page sizes (10-100)",
                        "First/Prev/Next/Last controls",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* CRUD Operations */}
                  <Card className="border-l-4 border-l-orange-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Edit className="h-5 w-5 text-orange-600" />
                        CRUD Operations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "Create with auto-forms",
                        "Read with detail viewer",
                        "Update with pre-filled forms",
                        "Delete with confirmation",
                        "Custom handlers support",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Search & Filters */}
                  <Card className="border-l-4 border-l-cyan-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Search className="h-5 w-5 text-cyan-600" />
                        Search & Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "Multi-field search",
                        "Debounced input (500ms)",
                        "Select & multiselect filters",
                        "Active filter badges",
                        "Clear all filters button",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Data Export */}
                  <Card className="border-l-4 border-l-pink-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Download className="h-5 w-5 text-pink-600" />
                        Data Export
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "CSV export",
                        "Excel (XLSX) export",
                        "PDF with auto-table",
                        "Print preview",
                        "Export selected rows only",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Row Selection */}
                  <Card className="border-l-4 border-l-indigo-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Layers className="h-5 w-5 text-indigo-600" />
                        Row Selection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "Checkbox selection",
                        "Select all/none toggle",
                        "Bulk actions on selected",
                        "Selection callbacks",
                        "Visual selection state",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Mobile Responsive */}
                  <Card className="border-l-4 border-l-red-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-red-600" />
                        Mobile Responsive
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "Auto card view on mobile (<768px)",
                        "Touch-friendly controls",
                        "Responsive pagination",
                        "Mobile-optimized forms",
                        "Adaptive toolbar layout",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Column Management */}
                  <Card className="border-l-4 border-l-yellow-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TableIcon className="h-5 w-5 text-yellow-600" />
                        Column Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "Show/hide columns dropdown",
                        "localStorage persistence",
                        "Column sorting (asc/desc)",
                        "Flexible column config",
                        "Auto-generated actions column",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Form Fields */}
                  <Card className="border-l-4 border-l-teal-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-5 w-5 text-teal-600" />
                        Form Fields (10+ Types)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "text, email, tel, number",
                        "select, multiselect",
                        "textarea, date, checkbox",
                        "Custom validation per field",
                        "Auto-form generation from config",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Customization */}
                  <Card className="border-l-4 border-l-violet-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Code className="h-5 w-5 text-violet-600" />
                        Deep Customization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "Custom add/edit forms",
                        "Custom row viewers",
                        "Custom CRUD handlers",
                        "Custom field formatters",
                        "50+ configuration props",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Developer Experience */}
                  <Card className="border-l-4 border-l-blue-600 hover:shadow-xl transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-blue-600" />
                        Developer Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        "TypeScript first with generics",
                        "Full type safety",
                        "Detailed error messages",
                        "Toast notifications",
                        "Loading states & transitions",
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== TAB: PROPS API ==================== */}
          <TabsContent value="props" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Settings className="h-6 w-6 text-blue-600" />
                  Complete Props API Reference
                </CardTitle>
                <CardDescription className="text-base">
                  All 50+ props with types, defaults, and examples
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Core Props Section */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Core Data Props (Required)
                  </h3>
                  <div className="space-y-4">
                    <PropDoc
                      name="initialData"
                      type="TableResponse<T>"
                      required
                      description="Initial data loaded on the server. Must include data array and pagination object with totalCount, hasNextPage, nextCursor."
                      example={`const initialData = await fetchTableData('/api/users', {
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

<DynamicServerTable initialData={initialData} .../>`}
                    />

                    <PropDoc
                      name="columns"
                      type="ColumnDef<T>[]"
                      required
                      description="TanStack Table column definitions. Define table structure including an 'actions' column for CRUD buttons."
                      example={`const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'email', header: 'Email' },
  { id: 'actions', header: 'Actions' }, // Auto-populated
];`}
                    />

                    <PropDoc
                      name="fetchData"
                      type="(params: TableParams) => Promise<TableResponse<T>>"
                      required
                      description="Server action to fetch data. Receives pagination, search, filter params and returns data response."
                      example={`fetchData={async (params) => {
  'use server';
  return fetchTableData('/api/users', params);
}}`}
                    />

                    <PropDoc
                      name="tableKey"
                      type="string"
                      required
                      description="Unique identifier for this table instance. Used for localStorage and URL state management."
                      example={`tableKey="users-table"`}
                    />
                  </div>
                </div>

                <Separator />

                {/* CRUD Props */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Edit className="h-5 w-5 text-purple-600" />
                    CRUD Configuration (11 props)
                  </h3>
                  <div className="space-y-4">
                    <PropDoc
                      name="apiEndpoint"
                      type="string"
                      description="Base API endpoint for default CRUD handlers. If provided, auto-generates POST/PUT/DELETE calls."
                      example={`apiEndpoint="/api/bookings"`}
                    />

                    <PropDoc
                      name="formFields"
                      type="FormFieldConfig[]"
                      description="Array of form field configurations for auto-generated add/edit forms. Supports 10+ field types."
                      example={`formFields={[
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true,
    validation: (v) => !v.includes('@') ? 'Invalid email' : undefined },
  { name: 'role', label: 'Role', type: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]},
]}`}
                    />

                    <PropDoc
                      name="showAddButton"
                      type="boolean"
                      defaultValue="true"
                      description="Show/hide add new record button in toolbar."
                      example={`showAddButton={true}`}
                    />

                    <PropDoc
                      name="addButtonLabel"
                      type="string"
                      defaultValue='"Add New"'
                      description="Custom label for add button."
                      example={`addButtonLabel="New Booking"`}
                    />

                    <PropDoc
                      name="customAddForm"
                      type="React.ReactNode"
                      description="Replace auto-generated add form with your own custom component."
                      example={`customAddForm={<CustomBookingForm onSubmit={handleCreate} />}`}
                    />

                    <PropDoc
                      name="customEditForm"
                      type="(data: T) => React.ReactNode"
                      description="Replace auto-generated edit form. Function receives current record data."
                      example={`customEditForm={(booking) => (
  <CustomBookingEditForm
    initialData={booking}
    onSubmit={handleUpdate}
  />
)}`}
                    />
                  </div>
                </div>

                <Separator />

                {/* Quick reference for remaining props */}
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    All Other Props (Quick Reference)
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Card className="p-4">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Search Props
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• searchable: boolean</li>
                        <li>• searchPlaceholder: string</li>
                        <li>• searchFields: string[]</li>
                      </ul>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter Props
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• filters: FilterConfig[]</li>
                        <li> - field, label, type</li>
                        <li> - options array</li>
                      </ul>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Mouse className="h-4 w-4" />
                        Pagination Props
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• pageSize: number (default: 10)</li>
                        <li>• pageSizeOptions: number[]</li>
                        <li>• defaultSortBy: string</li>
                        <li>• defaultSortOrder: 'asc' | 'desc'</li>
                      </ul>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Selection Props
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• selectable: boolean</li>
                        <li>• bulkActions: BulkActionConfig[]</li>
                        <li>• onSelectionChange: callback</li>
                      </ul>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Props
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• exportable: boolean</li>
                        <li>• exportFileName: string</li>
                        <li>• exportConfig: object</li>
                      </ul>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Viewer Props
                      </h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• viewerTitle: string</li>
                        <li>• viewerFieldConfig: object</li>
                        <li>• customRowViewer: component</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Remaining tabs with structured content */}
          <TabsContent value="crud" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CRUD Operations Guide</CardTitle>
                <CardDescription>
                  Complete examples for Create, Read, Update, Delete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See the <strong>Overview</strong> tab for complete CRUD
                  implementation examples. The production example shows full
                  CRUD configuration with apiEndpoint and formFields.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Field Types</CardTitle>
                <CardDescription>All 10+ supported field types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Supported types:</strong> text, email, tel, number,
                    select, multiselect, textarea, date, checkbox, password
                  </p>
                  <p className="text-muted-foreground">
                    See formFields prop in <strong>Props API</strong> tab for
                    examples.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Configuration</CardTitle>
                <CardDescription>
                  Multi-field search with debouncing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <pre className="bg-muted p-4 rounded text-sm">
                  {`searchable={true}
searchPlaceholder="Search..."
searchFields={['name', 'email', 'phone']}`}
                </pre>
                <p className="text-sm text-muted-foreground">
                  Search is debounced (500ms) to prevent excessive API calls.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filter Configuration</CardTitle>
                <CardDescription>
                  Select and multiselect filters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded text-sm whitespace-pre-wrap">
                  {`filters={[
  {
    field: 'status',
    label: 'Status',
    type: 'multiselect',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  }
]}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Actions</CardTitle>
                <CardDescription>
                  Perform actions on selected rows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded text-sm whitespace-pre-wrap">
                  {`selectable={true}
bulkActions={[
  {
    label: 'Send Email',
    icon: <Mail className="h-4 w-4" />,
    onClick: (selectedRows) => {
      // Your bulk logic
    },
    variant: 'default'
  }
]}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>CSV, Excel, PDF, Print</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded text-sm">
                  {`exportable={true}
exportFileName="data-export"
exportConfig={{
  csv: true,
  excel: true,
  pdf: true,
  print: true
}}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Customization</CardTitle>
                <CardDescription>
                  Custom forms, viewers, and handlers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2">Custom Forms</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    {`customAddForm={<MyCustomForm />}
customEditForm={(data) => <MyEditForm data={data} />}`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Custom Row Viewer</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    {`customRowViewer={(data) => <MyViewer data={data} />}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ==================== FOOTER ==================== */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white border-0 shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <CardContent className="relative pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm animate-bounce">
                  <Rocket className="h-16 w-16 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-3">
                  You're Ready to Build! 🚀
                </h3>
                <p className="text-white/90 max-w-3xl mx-auto text-lg leading-relaxed">
                  This documentation covers all features, props, and
                  configurations in DynamicServerTable v2.0. Check out{" "}
                  <strong>Bookings</strong> and <strong>Flights</strong> pages
                  for live implementations!
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-6">
                {[
                  { icon: Globe, text: "URL State" },
                  { icon: History, text: "Browser Nav" },
                  { icon: Rocket, text: "Production Ready" },
                  { icon: Smartphone, text: "Mobile First" },
                  { icon: Zap, text: "Lightning Fast" },
                  { icon: Lock, text: "Type Safe" },
                ].map((badge, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-sm py-2.5 px-5 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors"
                  >
                    <badge.icon className="h-4 w-4 mr-2" />
                    {badge.text}
                  </Badge>
                ))}
              </div>
              <Separator className="my-8 bg-white/20" />
              <div className="space-y-3">
                <p className="text-white/90 text-sm font-semibold">
                  💡 Pro Tips
                </p>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <strong>Shareable Links:</strong> All table state is in the
                    URL
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <strong>Custom Forms:</strong> Use
                    customAddForm/customEditForm
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <strong>Bulk Actions:</strong> Enable selection for batch
                    ops
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

{
  /* ==================== HELPER COMPONENT ==================== */
}
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
    <div className="border-2 rounded-lg p-5 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <code className="text-sm font-mono bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow-md">
            {name}
          </code>
          {required && (
            <Badge
              variant="destructive"
              className="text-xs font-semibold shadow-md"
            >
              REQUIRED
            </Badge>
          )}
        </div>
        <code className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-md border whitespace-nowrap font-mono">
          {type}
        </code>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{description}</p>
      {defaultValue && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Default
          </Badge>
          <code className="text-xs bg-muted px-3 py-1.5 rounded border font-mono">
            {defaultValue}
          </code>
        </div>
      )}
      {example && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold text-primary">Example:</p>
          </div>
          <pre className="text-xs bg-gradient-to-br from-muted to-muted/50 p-4 rounded-lg border-2 overflow-x-auto font-mono leading-relaxed shadow-inner whitespace-pre-wrap">
            {example}
          </pre>
        </div>
      )}
    </div>
  );
}
