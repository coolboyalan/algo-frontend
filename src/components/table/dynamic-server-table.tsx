'use client';

import { useState, useTransition, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
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
} from "lucide-react";
import { TableParams, TableResponse, TableFilter } from "@/app/actions/table-data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RowViewerDialog, RowViewerFieldConfig } from "./row-viewer-dialog";

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

  // Row viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerData, setViewerData] = useState<T | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const hasSearchChanged = useRef(false);
  const hasFiltersChanged = useRef(false);
  const hasSortingChanged = useRef(false);

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
      const selectedData = data.filter((row) => newSelection.has(String(row[rowIdField])) );
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
    return exportSource.map((row) => {
      const exportRow: any = {};
      columns.forEach((col) => {
        if (col.accessorKey && typeof col.accessorKey === "string") {
          const header = col.header as string;
          exportRow[header] = row[col.accessorKey];
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

  // Inject view button in actions column
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
    state: { sorting },
  });

  const startRecord = (currentPage - 1) * currentPageSize + 1;
  const endRecord = Math.min((currentPage - 1) * currentPageSize + data.length, pagination.totalCount || 0);

  return (
    <div className="space-y-4">
      {/* Search and export bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchInput && (
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6" onClick={() => setSearchInput("")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {exportable && (
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {exportConfig.csv && (
                    <DropdownMenuItem onClick={() => exportToCSV(false)} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">CSV</div>
                        <div className="text-xs text-muted-foreground">Comma-separated</div>
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
                        <div className="text-xs text-muted-foreground">Document</div>
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
            </div>
          )}
        </div>

        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters:</span>
            </div>

            <div className="flex flex-wrap gap-2 flex-1">
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
                          <span>{filter.label}</span>
                          {hasSelection && (
                            <Badge variant="secondary" className="h-5 px-1.5 rounded-full">
                              {selectedValues.length}
                            </Badge>
                          )}
                          <ChevronDown className="h-3 w-3 opacity-50" />
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
        <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary rounded-lg">
          <div className="flex items-center gap-3">
            <Checkbox checked={true} className="pointer-events-none" />
            <span className="font-medium">
              {selectedRows.size} {selectedRows.size === 1 ? "row" : "rows"} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {exportable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
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
                className="gap-2"
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
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4 order-2 sm:order-1">
          <div className="text-sm text-muted-foreground">
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
            <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
            <Select value={currentPageSize.toString()} onValueChange={(value) => handlePageSizeChange(parseInt(value))}>
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
            className="h-8 w-8 p-0"
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={!pagination.hasPreviousPage || isPending}
            className="h-8 gap-1"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-2 px-3 py-1 border rounded-md bg-muted/50">
            <span className="text-sm font-medium">Page {currentPage}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage || isPending}
            className="h-8 gap-1"
            title="Next page"
          >
            <span className="hidden sm:inline">Next</span>
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
