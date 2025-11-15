'use client';

import { useState, useTransition, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Loader2,
  ArrowUpDown,
  X,
  Filter,
  ChevronDown,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  Eye,
  Settings2,
  MoreVertical,
} from "lucide-react";
import { TableParams, TableResponse, TableFilter } from "@/app/actions/table-data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Hash, Mail, Phone, User, DollarSign } from "lucide-react";

export interface RowViewerFieldConfig {
  label?: string;
  icon?: React.ReactNode;
  format?: (value: any) => React.ReactNode;
  hidden?: boolean;
}

interface RowViewerDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T | null;
  title?: string;
  subtitle?: string;
  fieldConfig?: Record<string, RowViewerFieldConfig>;
}

function RowViewerDialog<T extends Record<string, any>>({
  open,
  onOpenChange,
  data,
  title = "Details",
  subtitle,
  fieldConfig = {},
}: RowViewerDialogProps<T>) {
  if (!data) return null;

  const formatFieldName = (key: string): string =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();

  const getFieldIcon = (key: string): React.ReactNode => {
    if (fieldConfig[key]?.icon) return fieldConfig[key].icon;
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes("email")) return <Mail className="h-4 w-4" />;
    if (lowerKey.includes("phone")) return <Phone className="h-4 w-4" />;
    if (lowerKey.includes("name")) return <User className="h-4 w-4" />;
    if (lowerKey.includes("date")) return <Calendar className="h-4 w-4" />;
    if (lowerKey.includes("time") || lowerKey.includes("at")) return <Clock className="h-4 w-4" />;
    if (lowerKey.includes("id") || lowerKey.includes("number")) return <Hash className="h-4 w-4" />;
    if (lowerKey.includes("amount") || lowerKey.includes("price")) return <DollarSign className="h-4 w-4" />;
    return null;
  };

  const formatValue = (key: string, value: any): React.ReactNode => {
    if (fieldConfig[key]?.format) return fieldConfig[key].format!(value);
    if (value === null || value === undefined)
      return <span className="text-muted-foreground italic">Not set</span>;
    if (typeof value === "boolean")
      return value ? <Badge variant="default">Yes</Badge> : <Badge variant="secondary">No</Badge>;
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("at")) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
        }
      } catch {}
    }
    if (key.toLowerCase().includes("status") || key.toLowerCase().includes("state")) {
      const statusColors: Record<string, string> = {
        confirmed: "default",
        completed: "default",
        active: "default",
        success: "default",
        paid: "default",
        pending: "secondary",
        processing: "secondary",
        cancelled: "destructive",
        failed: "destructive",
        rejected: "destructive",
      };
      const variant = statusColors[String(value).toLowerCase()] || "outline";
      return <Badge variant={variant as any}>{String(value)}</Badge>;
    }
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, idx) => (
            <Badge key={idx} variant="outline">
              {String(item)}
            </Badge>
          ))}
        </div>
      );
    }
    if (typeof value === "object")
      return <code className="text-xs bg-muted p-1 rounded">{JSON.stringify(value)}</code>;
    return String(value);
  };

  const fields = Object.keys(data).filter((key) => !fieldConfig[key]?.hidden);
  const primaryId =
    fields.find((key) => key.toLowerCase().includes("id") || key.toLowerCase().includes("number")) ||
    fields[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {title}
            {primaryId && <Badge variant="outline" className="font-mono">{data[primaryId]}</Badge>}
          </DialogTitle>
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>
        <Separator />
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {fields.map((key) => {
              const config = fieldConfig[key] || {};
              const label = config.label || formatFieldName(key);
              const icon = getFieldIcon(key);
              const value = formatValue(key, data[key]);
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {icon}
                    <span>{label}</span>
                  </div>
                  <div className="text-base pl-6">{value}</div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface DynamicServerTableProps<T> {
  initialData: TableResponse<T>;
  columns: ColumnDef<T>[];
  fetchData: (params: TableParams) => Promise<TableResponse<T>>;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: string[];
  filters?: {
    field: string;
    label: string;
    type: "select" | "multiselect";
    options?: { label: string; value: string }[];
  }[];
  defaultSortBy?: string;
  defaultSortOrder?: "asc" | "desc";
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: T) => void;
  exportable?: boolean;
  exportFileName?: string;
  exportConfig?: {
    csv?: boolean;
    excel?: boolean;
    pdf?: boolean;
    print?: boolean;
  };
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  bulkActions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (selectedRows: T[]) => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
  }[];
  rowIdField?: string;
  viewerTitle?: string;
  viewerSubtitle?: string;
  viewerFieldConfig?: Record<string, RowViewerFieldConfig>;
  tableKey?: string;
}

export function DynamicServerTable<T extends Record<string, any>>({
  initialData,
  columns,
  fetchData,
  searchable = true,
  searchPlaceholder = "Search...",
  searchFields = [],
  filters = [],
  defaultSortBy,
  defaultSortOrder = "asc",
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onRowClick,
  exportable = false,
  exportFileName = "data",
  exportConfig = { csv: true, excel: true, pdf: true, print: true },
  selectable = false,
  onSelectionChange,
  bulkActions = [],
  rowIdField = "id",
  viewerTitle = "Details",
  viewerSubtitle,
  viewerFieldConfig = {},
  tableKey = "default-table",
}: DynamicServerTableProps<T>) {
  const [data, setData] = useState<T[]>(initialData.data);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<TableFilter[]>([]);
  const [sorting, setSorting] = useState<SortingState>(
    defaultSortBy ? [{ id: defaultSortBy, desc: defaultSortOrder === "desc" }] : []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [isPending, startTransition] = useTransition();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerData, setViewerData] = useState<T | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const hasSearchChanged = useRef(false);
  const hasFiltersChanged = useRef(false);
  const hasSortingChanged = useRef(false);

  const storageKey = `table-column-visibility-${tableKey}`;

  const getInitialColumnVisibility = (): VisibilityState => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(getInitialColumnVisibility);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(columnVisibility));
      } catch (error) {
        console.error("Failed to save column visibility:", error);
      }
    }
  }, [columnVisibility, storageKey]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleViewRow = (row: T) => {
    setViewerData(row);
    setViewerOpen(true);
  };

  const toggleRowSelection = (rowId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }
    setSelectedRows(newSelection);

    if (onSelectionChange) {
      const selectedData = data.filter((row) => newSelection.has(String(row[rowIdField])));
      onSelectionChange(selectedData);
    }
  };

  const toggleAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    } else {
      const allIds = new Set(data.map((row) => String(row[rowIdField])));
      setSelectedRows(allIds);
      if (onSelectionChange) onSelectionChange(data);
    }
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
    if (onSelectionChange) onSelectionChange([]);
  };

  const getSelectedData = (): T[] => {
    return data.filter((row) => selectedRows.has(String(row[rowIdField])));
  };

  const getExportData = (selectedOnly: boolean = false): any[] => {
    const exportSource = selectedOnly ? getSelectedData() : data;
    const visibleColumns = table.getVisibleLeafColumns();

    return exportSource.map((row) => {
      const exportRow: any = {};
      visibleColumns.forEach((col) => {
        if (col.id !== 'select' && col.id !== 'actions' && col.columnDef.accessorKey) {
          const key = col.columnDef.accessorKey as string;
          const header = (col.columnDef.header as string) || key;
          exportRow[header] = row[key];
        }
      });
      return exportRow;
    });
  };

  const exportToCSV = (selectedOnly: boolean = false) => {
    const exportData = getExportData(selectedOnly);
    if (exportData.length === 0) {
      alert(selectedOnly ? "No rows selected" : "No data to export");
      return;
    }

    const headers = Object.keys(exportData[0]);

    const csv = [
      headers.join(","),
      ...exportData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFileName}-${selectedOnly ? "selected-" : ""}${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = (selectedOnly: boolean = false) => {
    const exportData = getExportData(selectedOnly);
    if (exportData.length === 0) {
      alert(selectedOnly ? "No rows selected" : "No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const colWidths = Object.keys(exportData[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...exportData.map((row) => String(row[key] || "").length)
      ) + 2,
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(
      workbook,
      `${exportFileName}-${selectedOnly ? "selected-" : ""}${new Date()
        .toISOString()
        .split("T")[0]}.xlsx`
    );
  };

  const exportToPDF = (selectedOnly: boolean = false) => {
    const exportData = getExportData(selectedOnly);
    if (exportData.length === 0) {
      alert(selectedOnly ? "No rows selected" : "No data to export");
      return;
    }

    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text(
      `${exportFileName.charAt(0).toUpperCase() + exportFileName.slice(1)} Report`,
      14,
      20
    );

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(
      `Total Records: ${exportData.length}${selectedOnly ? " (selected)" : ""}`,
      14,
      34
    );

    const headers = Object.keys(exportData[0]);
    const body = exportData.map((row) => headers.map((h) => row[h]));

    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: body,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    doc.save(
      `${exportFileName}-${selectedOnly ? "selected-" : ""}${new Date()
        .toISOString()
        .split("T")[0]}.pdf`
    );
  };

  const handlePrint = (selectedOnly: boolean = false) => {
    const exportData = getExportData(selectedOnly);
    if (exportData.length === 0) {
      alert(selectedOnly ? "No rows selected" : "No data to print");
      return;
    }

    const headers = Object.keys(exportData[0]);

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${exportFileName} - Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e40af; margin-bottom: 10px; }
            .meta { color: #666; margin-bottom: 20px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; border: 1px solid #ddd; font-size: 12px; }
            td { padding: 10px; border: 1px solid #ddd; font-size: 11px; }
            tr:nth-child(even) { background-color: #f9fafb; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>${exportFileName.charAt(0).toUpperCase() + exportFileName.slice(1)} Report</h1>
          <div class="meta">
            <div>Generated: ${new Date().toLocaleString()}</div>
            <div>Total Records: ${
              exportData.length + (selectedOnly ? " (selected)" : "")
            }</div>
          </div>
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${exportData
                .map(
                  (row) =>
                    `<tr>${headers
                      .map((h) => `<td>${row[h] !== null && row[h] !== undefined ? row[h] : ""}</td>`)
                      .join("")}</tr>`
                )
                .join("")}
            </tbody>
          </table>
          <br>
          <button
            onclick="window.print()"
            style="
              padding: 10px 20px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
            "
          >
            Print
          </button>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const performFetch = (cursor?: string, pageNum?: number) => {
    startTransition(async () => {
      try {
        const params: TableParams = {
          cursor: cursor || undefined,
          limit: currentPageSize,
          sortBy: sorting[0]?.id || defaultSortBy,
          sortOrder: sorting[0]?.desc ? "desc" : defaultSortOrder,
          searchQuery: debouncedSearch || undefined,
          searchFields: searchFields.length > 0 ? searchFields : undefined,
          filters: activeFilters.length > 0 ? activeFilters : undefined,
        };

        const result = await fetchData(params);
        setData(result.data);
        setPagination(result.pagination);
        if (pageNum !== undefined) setCurrentPage(pageNum);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });
  };

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      if (searchInput !== debouncedSearch) {
        hasSearchChanged.current = true;
        setDebouncedSearch(searchInput);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchInput]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (hasSearchChanged.current) {
      hasSearchChanged.current = false;
      clearSelection();
      performFetch(undefined, 1);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (hasFiltersChanged.current) {
      hasFiltersChanged.current = false;
      clearSelection();
      performFetch(undefined, 1);
    }
  }, [activeFilters]);

  useEffect(() => {
    if (hasSortingChanged.current) {
      hasSortingChanged.current = false;
      clearSelection();
      performFetch(undefined, 1);
    }
  }, [sorting]);

  const handleNextPage = () => {
    if (!pagination.hasNextPage || !pagination.nextCursor) return;
    clearSelection();
    performFetch(pagination.nextCursor, currentPage + 1);
  };

  const handlePrevPage = () => {
    if (!pagination.hasPreviousPage || !pagination.previousCursor) return;
    clearSelection();
    performFetch(pagination.previousCursor, currentPage - 1);
  };

  const handleFirstPage = () => {
    if (currentPage === 1) return;
    clearSelection();
    performFetch(undefined, 1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setCurrentPageSize(newSize);
    setCurrentPage(1);
    clearSelection();

    startTransition(async () => {
      try {
        const params: TableParams = {
          limit: newSize,
          sortBy: sorting[0]?.id || defaultSortBy,
          sortOrder: sorting[0]?.desc ? "desc" : defaultSortOrder,
          searchQuery: debouncedSearch || undefined,
          searchFields: searchFields.length > 0 ? searchFields : undefined,
          filters: activeFilters.length > 0 ? activeFilters : undefined,
        };
        const result = await fetchData(params);
        setData(result.data);
        setPagination(result.pagination);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = activeFilters.filter((f) => f.field !== field);
    if (value && value !== "all") {
      newFilters.push({ field, operator: "equals", value });
    }
    hasFiltersChanged.current = true;
    setActiveFilters(newFilters);
  };

  const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
    const currentFieldFilters = activeFilters.filter((f) => f.field === field);
    const otherFilters = activeFilters.filter((f) => f.field !== field);
    hasFiltersChanged.current = true;
    if (checked) {
      setActiveFilters([...otherFilters, ...currentFieldFilters, { field, operator: "equals", value }]);
    } else {
      setActiveFilters([...otherFilters, ...currentFieldFilters.filter((f) => f.value !== value)]);
    }
  };

  const getSelectedValues = (field: string): string[] => {
    return activeFilters.filter((f) => f.field === field).map((f) => f.value);
  };

  const removeFilter = (field: string, value?: string) => {
    hasFiltersChanged.current = true;
    if (value) {
      setActiveFilters(activeFilters.filter((f) => !(f.field === field && f.value === value)));
    } else {
      setActiveFilters(activeFilters.filter((f) => f.field !== field));
    }
  };

  const clearAllFilters = () => {
    hasFiltersChanged.current = true;
    setActiveFilters([]);
  };

  const handleSortingChange = (newSorting: SortingState) => {
    hasSortingChanged.current = true;
    setSorting(newSorting);
  };

  const tableColumns = selectable
    ? [
        {
          id: "select",
          header: () => (
            <Checkbox
              checked={selectedRows.size === data.length && data.length > 0}
              onCheckedChange={() => {
                if (selectedRows.size === data.length) setSelectedRows(new Set());
                else setSelectedRows(new Set(data.map((row) => String(row[rowIdField]))));
              }}
              aria-label="Select all"
              className="translate-y-[2px]"
            />
          ),
          cell: ({ row }: any) => (
            <Checkbox
              checked={selectedRows.has(String(row.original[rowIdField]))}
              onCheckedChange={() =>
                setSelectedRows((prev) => {
                  const newSet = new Set(prev);
                  const id = String(row.original[rowIdField]);
                  newSet.has(id) ? newSet.delete(id) : newSet.add(id);
                  return newSet;
                })
              }
              aria-label="Select row"
              className="translate-y-[2px]"
              onClick={(e) => e.stopPropagation()}
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...columns,
      ]
    : columns;

  const finalColumns: ColumnDef<T>[] = tableColumns.map((col) =>
    col.id === "actions"
      ? {
          ...col,
          cell: (ctx) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                title="View Details"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewRow(ctx.row.original);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {col.cell ? col.cell(ctx) : null}
            </div>
          ),
        }
      : col
  );

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  const startRecord = (currentPage - 1) * currentPageSize + 1;
  const endRecord = Math.min(
    (currentPage - 1) * currentPageSize + data.length,
    pagination.totalCount || 0
  );

  const MobileCardView = () => (
    <div className="space-y-4">
      {isPending ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground mt-2">Loading...</span>
        </div>
      ) : data.length > 0 ? (
        data.map((row, idx) => (
          <Card key={idx} className="overflow-hidden">
            <CardContent className="p-4">
              {selectable && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                  <Checkbox
                    checked={selectedRows.has(String(row[rowIdField]))}
                    onCheckedChange={() => toggleRowSelection(String(row[rowIdField]))}
                  />
                  <span className="text-sm text-muted-foreground">Select</span>
                </div>
              )}

              <div className="space-y-3">
                {table.getVisibleLeafColumns().map((col) => {
                  if (col.id === 'actions' || col.id === 'select') return null;
                  const value = col.columnDef.accessorKey ? row[col.columnDef.accessorKey as string] : null;
                  return (
                    <div key={col.id} className="flex justify-between items-start gap-4">
                      <span className="text-sm font-medium text-muted-foreground min-w-[100px]">
                        {col.columnDef.header as string}:
                      </span>
                      <span className="text-sm text-right flex-1">
                        {col.columnDef.cell
                          ? flexRender(col.columnDef.cell, {
                              getValue: () => value,
                              row: { original: row } as any,
                            } as any)
                          : value}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewRow(row)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                {columns.find((col) => col.id === 'actions') && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewRow(row)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-muted-foreground" />
          <span className="text-sm font-medium mt-2">No results found</span>
          <span className="text-xs text-muted-foreground">Try adjusting your search or filters</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-10 h-10"
              />
              {searchInput && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchInput("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {(
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default" className="h-10 gap-2">
                    <Settings2 className="h-4 w-4" />
                    <span>Columns</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-1 p-1">
                      {table
                        .getAllColumns()
                        .filter(
                          (column) =>
                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                        )
                        .map((column) => {
                          return (
                            <div
                              key={column.id}
                              className="flex items-center gap-2 p-2 hover:bg-muted rounded-sm cursor-pointer"
                              onClick={() => column.toggleVisibility(!column.getIsVisible())}
                            >
                              <Checkbox
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                  column.toggleVisibility(!!value)
                                }
                              />
                              <span className="text-sm capitalize">
                                {column.id.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </ScrollArea>
                  <DropdownMenuSeparator />
                  <div className="p-1 space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => table.toggleAllColumnsVisible(true)}
                    >
                      Show All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => table.toggleAllColumnsVisible(false)}
                    >
                      Hide All
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {exportable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default" className="h-10 gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {exportConfig.csv && (
                    <DropdownMenuItem onClick={() => exportToCSV(false)} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">CSV</div>
                        <div className="text-xs text-muted-foreground">Comma-separated values</div>
                      </div>
                    </DropdownMenuItem>
                  )}
                  {exportConfig.excel && (
                    <DropdownMenuItem onClick={() => exportToExcel(false)} className="cursor-pointer">
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">Excel</div>
                        <div className="text-xs text-muted-foreground">XLSX format</div>
                      </div>
                    </DropdownMenuItem>
                  )}
                  {exportConfig.pdf && (
                    <DropdownMenuItem onClick={() => exportToPDF(false)} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-red-600" />
                      <div>
                        <div className="font-medium">PDF</div>
                        <div className="text-xs text-muted-foreground">Portable document</div>
                      </div>
                    </DropdownMenuItem>
                  )}
                  {exportConfig.print && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handlePrint(false)} className="cursor-pointer">
                        <Printer className="mr-2 h-4 w-4" />
                        <div className="font-medium">Print</div>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => {
              const selectedValues = getSelectedValues(filter.field);
              const hasSelection = selectedValues.length > 0;

              if (filter.type === "multiselect") {
                return (
                  <Popover key={filter.field}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-9 gap-2",
                          hasSelection && "border-primary bg-primary/5"
                        )}
                      >
                        <Filter className="h-3 w-3" />
                        <span>{filter.label}</span>
                        {hasSelection && (
                          <Badge variant="secondary" className="h-5 px-1.5 rounded-full ml-1">
                            {selectedValues.length}
                          </Badge>
                        )}
                        <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-2" align="start">
                      <div className="space-y-1">
                        {filter.options?.map((option) => {
                          const isChecked = selectedValues.includes(option.value);
                          return (
                            <div
                              key={option.value}
                              className="flex items-center gap-2 p-2 hover:bg-muted rounded-sm cursor-pointer"
                              onClick={() =>
                                handleMultiSelectChange(
                                  filter.field,
                                  option.value,
                                  !isChecked
                                )
                              }
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                  handleMultiSelectChange(
                                    filter.field,
                                    option.value,
                                    checked as boolean
                                  )
                                }
                              />
                              <span className="text-sm">{option.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              } else {
                return (
                  <Select
                    key={filter.field}
                    value={activeFilters.find((f) => f.field === filter.field)?.value || "all"}
                    onValueChange={(value) => handleFilterChange(filter.field, value)}
                  >
                    <SelectTrigger className="h-9 w-[140px] sm:w-[160px]">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {filter.label}</SelectItem>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }
            })}
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="flex items-start gap-2 flex-wrap p-3 bg-muted/30 rounded-lg border border-dashed">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap mt-0.5">
              Active:
            </span>
            <div className="flex flex-wrap gap-2 flex-1">
              {Object.entries(
                activeFilters.reduce((acc, filter) => {
                  if (!acc[filter.field]) acc[filter.field] = [];
                  acc[filter.field].push(filter.value);
                  return acc;
                }, {} as Record<string, string[]>)
              ).map(([field, values]) => {
                const filterConfig = filters.find((f) => f.field === field);
                if (values.length === 1) {
                  const option = filterConfig?.options?.find((o) => o.value === values[0]);
                  return (
                    <Badge
                      key={`${field}-${values[0]}`}
                      variant="secondary"
                      className="gap-1 pl-2 pr-1"
                    >
                      <span className="font-medium">{filterConfig?.label}:</span>
                      <span>{option?.label || values[0]}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent ml-1"
                        onClick={() => removeFilter(field, values[0])}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                } else {
                  return (
                    <Badge key={field} variant="secondary" className="gap-1 pl-2 pr-1">
                      <span className="font-medium">{filterConfig?.label}:</span>
                      <span>{values.length} selected</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent ml-1"
                        onClick={() => removeFilter(field)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                }
              })}
            </div>
            <Separator orientation="vertical" className="h-5" />
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs whitespace-nowrap">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {selectable && selectedRows.size > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-primary/10 border border-primary rounded-lg">
          <div className="flex items-center gap-3">
            <Checkbox checked={true} className="pointer-events-none" />
            <span className="font-medium">
              {selectedRows.size} {selectedRows.size === 1 ? "row" : "rows"} selected
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {exportable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial">
                    <Download className="h-4 w-4" />
                    Export Selected
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export {selectedRows.size} rows</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {exportConfig.csv && (
                    <DropdownMenuItem onClick={() => exportToCSV(true)} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-green-600" />
                      CSV
                    </DropdownMenuItem>
                  )}
                  {exportConfig.excel && (
                    <DropdownMenuItem onClick={() => exportToExcel(true)} className="cursor-pointer">
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                      Excel
                    </DropdownMenuItem>
                  )}
                  {exportConfig.pdf && (
                    <DropdownMenuItem onClick={() => exportToPDF(true)} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-red-600" />
                      PDF
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size="sm"
                onClick={() => {
                  action.onClick(getSelectedData());
                  clearSelection();
                }}
                className="gap-2 flex-1 sm:flex-initial"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}

            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {isMobile ? (
        <MobileCardView />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex items-center gap-2 cursor-pointer select-none hover:text-foreground"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && <ArrowUpDown className="h-4 w-4" />}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={finalColumns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                    className={onRowClick ? "cursor-pointer" : ""}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={finalColumns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">No results found</span>
                      <span className="text-xs text-muted-foreground">
                        Try adjusting your search or filters
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex flex-col sm:flex-row items-center gap-4 order-2 sm:order-1 w-full sm:w-auto">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            {pagination.totalCount !== undefined && pagination.totalCount > 0 ? (
              <span>
                Showing <span className="font-medium text-foreground">{startRecord}</span> to{" "}
                <span className="font-medium text-foreground">{endRecord}</span> of{" "}
                <span className="font-medium text-foreground">{pagination.totalCount}</span>{" "}
                results
              </span>
            ) : (
              <span>No results</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Rows:</span>
            <Select
              value={currentPageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFirstPage}
            disabled={currentPage === 1 || isPending}
            className="h-9 w-9 p-0"
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={!pagination.hasPreviousPage || isPending}
            className="h-9 px-3"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>

          <div className="flex items-center gap-2 px-3 py-1.5 border rounded-md bg-muted/50">
            <span className="text-sm font-medium">Page {currentPage}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage || isPending}
            className="h-9 px-3"
            title="Next page"
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <RowViewerDialog
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        data={viewerData}
        title={viewerTitle}
        subtitle={viewerSubtitle}
        fieldConfig={viewerFieldConfig}
      />
    </div>
  );
}
