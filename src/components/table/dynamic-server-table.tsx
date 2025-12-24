"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { TableParams, TableResponse } from "@/app/actions/table-data";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormDialog } from "@/components/forms/form-dialog";
import { FormFieldConfig } from "@/components/forms/auto-form-generator";
import { toast } from "sonner";
import {
  createRecord,
  updateRecord,
  deleteRecord,
} from "@/app/actions/table-data";
import { RowViewerDialog, RowViewerFieldConfig } from "./row-viewer-dialog";
import { MobileCardView } from "./mobile-card-view";
import { TableToolbar } from "./table-toolbar";
import { useTableState } from "./hooks/use-table-state";

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
  apiEndpoint?: string;
  formFields?: FormFieldConfig[];
  customAddForm?: React.ReactNode;
  customEditForm?: (data: T) => React.ReactNode;
  onCreateRecord?: (data: Partial<T>) => Promise<void>;
  onUpdateRecord?: (id: string, data: Partial<T>) => Promise<void>;
  onDeleteRecord?: (id: string) => Promise<void>;
  showAddButton?: boolean;
  addButtonLabel?: string;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  customRowViewer?: (data: T) => React.ReactNode;
  renderRowViewer?: (data: T, onClose: () => void) => React.ReactNode;
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
  apiEndpoint,
  formFields = [],
  customAddForm,
  customEditForm,
  onCreateRecord,
  onUpdateRecord,
  onDeleteRecord,
  showAddButton = true,
  addButtonLabel = "Add New",
  showEditButton = true,
  showDeleteButton = true,
  customRowViewer,
  renderRowViewer,
}: DynamicServerTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use custom hook for state management
  const {
    data,
    setData,
    pagination,
    setPagination,
    currentPage,
    setCurrentPage,
    currentPageSize,
    setCurrentPageSize,
    cursorHistory,
    setCursorHistory,
    searchInput,
    setSearchInput,
    debouncedSearch,
    activeFilters,
    handleFilterChange,
    handleMultiSelectChange,
    getSelectedValues,
    removeFilter,
    clearAllFilters,
    sorting,
    setSorting,
    selectedRows,
    setSelectedRows,
    columnVisibility,
    setColumnVisibility,
    isPending,
    isMobile,
    performFetch,
  } = useTableState({
    initialData,
    fetchData,
    tableKey,
    defaultSortBy,
    defaultSortOrder,
    pageSize,
    searchFields,
  });

  // URL-based dialog state
  const action = searchParams.get("action");
  const actionId = searchParams.get("actionId");

  // CRUD State
  const [viewerData, setViewerData] = useState<T | null>(null);
  const [editingRecord, setEditingRecord] = useState<T | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived dialog state from URL
  const viewerOpen = action === "view";
  const isAddFormOpen = action === "add";
  const isEditFormOpen = action === "edit";
  const deleteConfirmOpen = action === "delete";

  // Helper to update dialog state in URL
  const updateDialogState = (newAction: string | null, id?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newAction === null) {
      // Close all dialogs
      params.delete("action");
      params.delete("actionId");
    } else {
      params.set("action", newAction);
      if (id) {
        params.set("actionId", id);
      } else {
        params.delete("actionId");
      }
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.push(newUrl, { scroll: false });
  };

  // Close dialog handler
  const closeDialog = () => {
    updateDialogState(null);
    setViewerData(null);
    setEditingRecord(null);
    setRecordToDelete(null);
  };

  // Load data when URL changes (for browser back/forward)
  useEffect(() => {
    if (action && actionId) {
      // Find the record by ID from current data
      const record = data.find((item) => String(item[rowIdField]) === actionId);

      if (record) {
        if (action === "view") {
          setViewerData(record);
        } else if (action === "edit") {
          setEditingRecord(record);
        } else if (action === "delete") {
          setRecordToDelete(record);
        }
      }
    } else {
      // Clear data when no action
      setViewerData(null);
      setEditingRecord(null);
      setRecordToDelete(null);
    }
  }, [action, actionId, data, rowIdField]);

  // Default CRUD handlers
  const defaultCreateHandler = async (data: Partial<T>) => {
    if (!apiEndpoint) throw new Error("API endpoint not configured");
    const response = await createRecord(apiEndpoint, data);
    return response;
  };

  const defaultUpdateHandler = async (id: string, data: Partial<T>) => {
    if (!apiEndpoint) throw new Error("API endpoint not configured");
    const response = await updateRecord(apiEndpoint, id, data);
    return response;
  };

  const defaultDeleteHandler = async (id: string) => {
    if (!apiEndpoint) throw new Error("API endpoint not configured");
    await deleteRecord(apiEndpoint, id);
  };

  const createHandler =
    onCreateRecord || (apiEndpoint ? defaultCreateHandler : undefined);
  const updateHandler =
    onUpdateRecord || (apiEndpoint ? defaultUpdateHandler : undefined);
  const deleteHandler =
    onDeleteRecord || (apiEndpoint ? defaultDeleteHandler : undefined);

  // CRUD Handlers
  const handleCreate = async (formData: Partial<T>) => {
    setIsSubmitting(true);
    try {
      if (createHandler) {
        await createHandler(formData);
        toast.success("Record created successfully");
        closeDialog();
        performFetch(undefined, 1);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create record",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (formData: Partial<T>) => {
    if (!editingRecord) return;
    setIsSubmitting(true);
    try {
      if (updateHandler) {
        await updateHandler(String(editingRecord[rowIdField]), formData);
        toast.success("Record updated successfully");
        closeDialog();
        const currentCursor = cursorHistory[cursorHistory.length - 1];
        performFetch(currentCursor, currentPage);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update record",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (row: T) => {
    updateDialogState("edit", String(row[rowIdField]));
  };

  const handleDeleteClick = (row: T) => {
    updateDialogState("delete", String(row[rowIdField]));
  };

  const confirmDelete = async () => {
    if (!recordToDelete || !deleteHandler) return;
    setIsSubmitting(true);
    try {
      await deleteHandler(String(recordToDelete[rowIdField]));
      toast.success("Record deleted successfully");
      closeDialog();
      const currentCursor = cursorHistory[cursorHistory.length - 1];
      performFetch(currentCursor, currentPage);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete record",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewRow = (row: T) => {
    updateDialogState("view", String(row[rowIdField]));
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination.hasNextPage && pagination.nextCursor) {
      setCursorHistory((prev) => [...prev, pagination.nextCursor ?? undefined]);
      performFetch(pagination.nextCursor, currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newHistory = [...cursorHistory];
      newHistory.pop();
      const prevCursor = newHistory[newHistory.length - 1];

      setCursorHistory(newHistory);
      performFetch(prevCursor, currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    if (currentPage !== 1) {
      setCursorHistory([undefined]);
      performFetch(undefined, 1);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setCurrentPageSize(newSize);
    setCurrentPage(1);
    setCursorHistory([undefined]);
    performFetch(undefined, 1, newSize);
  };

  // Selection handlers
  const toggleRowSelection = (rowId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }
    setSelectedRows(newSelection);
    if (onSelectionChange) {
      const selectedData = data.filter((row) =>
        newSelection.has(String(row[rowIdField])),
      );
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

  // Export functions
  const exportToCSV = (selectedOnly: boolean = false) => {
    const dataToExport = selectedOnly ? getSelectedData() : data;
    const visibleColumns = table
      .getAllColumns()
      .filter(
        (col) =>
          col.getIsVisible() && col.id !== "select" && col.id !== "actions",
      );

    const headers = visibleColumns.map((col) => String(col.columnDef.header));
    const rows = dataToExport.map((row) =>
      visibleColumns.map((col) => {
        const value = row[col.id as keyof T];
        return value !== null && value !== undefined ? String(value) : "";
      }),
    );

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${exportFileName}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const exportToExcel = (selectedOnly: boolean = false) => {
    const dataToExport = selectedOnly ? getSelectedData() : data;
    const visibleColumns = table
      .getAllColumns()
      .filter(
        (col) =>
          col.getIsVisible() && col.id !== "select" && col.id !== "actions",
      );

    const headers = visibleColumns.map((col) => String(col.columnDef.header));
    const rows = dataToExport.map((row) =>
      visibleColumns.map((col) => {
        const value = row[col.id as keyof T];
        return value !== null && value !== undefined ? value : "";
      }),
    );

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(
      wb,
      `${exportFileName}_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const exportToPDF = (selectedOnly: boolean = false) => {
    const dataToExport = selectedOnly ? getSelectedData() : data;
    const visibleColumns = table
      .getAllColumns()
      .filter(
        (col) =>
          col.getIsVisible() && col.id !== "select" && col.id !== "actions",
      );

    const doc = new jsPDF();
    const headers = visibleColumns.map((col) => String(col.columnDef.header));
    const rows = dataToExport.map((row) =>
      visibleColumns.map((col) => {
        const value = row[col.id as keyof T];
        return value !== null && value !== undefined ? String(value) : "";
      }),
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    doc.save(`${exportFileName}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handlePrint = (selectedOnly: boolean = false) => {
    const dataToExport = selectedOnly ? getSelectedData() : data;
    const visibleColumns = table
      .getAllColumns()
      .filter(
        (col) =>
          col.getIsVisible() && col.id !== "select" && col.id !== "actions",
      );

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const headers = visibleColumns.map((col) => String(col.columnDef.header));
    const rows = dataToExport.map((row) =>
      visibleColumns.map((col) => {
        const value = row[col.id as keyof T];
        return value !== null && value !== undefined ? String(value) : "";
      }),
    );

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print ${exportFileName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            h1 { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>${exportFileName}</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Build table columns
  const tableColumns = selectable
    ? [
      {
        id: "select",
        header: ({ table }: any) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={() => toggleAllRows()}
            aria-label="Select all"
          />
        ),
        cell: ({ row }: any) => (
          <input
            type="checkbox"
            checked={selectedRows.has(String(row.original[rowIdField]))}
            onChange={() =>
              toggleRowSelection(String(row.original[rowIdField]))
            }
            onClick={(e) => e.stopPropagation()}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ]
    : columns;

  const finalColumns: ColumnDef<T>[] = (() => {
    // Check if actions column already exists
    const hasActionsColumn = tableColumns.some((col) => col.id === "actions");

    // If actions column exists, merge with defaults
    if (hasActionsColumn) {
      return tableColumns.map((col) => {
        return col.id === "actions"
          ? {
            ...col,
            cell: (ctx) => (
              <div className="flex items-center gap-1">
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

                {updateHandler && showEditButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(ctx.row.original);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}

                {deleteHandler && showDeleteButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(ctx.row.original);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}

                {/* Render any custom actions from the original column */}
                {typeof col.cell === 'function' ? col.cell(ctx) : null}
              </div>
            ),
          }
          : col;
      });
    }

    // If no actions column exists, auto-inject it at the end
    return [
      ...tableColumns,
      {
        id: "actions",
        header: "Actions",
        cell: (ctx) => (
          <div className="flex items-center gap-1">
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

            {updateHandler && showEditButton && (
              <Button
                variant="ghost"
                size="icon"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(ctx.row.original);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}

            {deleteHandler && showDeleteButton && (
              <Button
                variant="ghost"
                size="icon"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(ctx.row.original);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ),
      } as ColumnDef<T>,
    ];
  })();

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
    manualSorting: true,
    manualPagination: true,
  });

  const startRecord = (currentPage - 1) * currentPageSize + 1;
  const endRecord = Math.min(
    currentPage * currentPageSize,
    pagination.totalCount || 0,
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <TableToolbar
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters}
        activeFilters={activeFilters}
        handleFilterChange={handleFilterChange}
        handleMultiSelectChange={handleMultiSelectChange}
        getSelectedValues={getSelectedValues}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
        table={table}
        exportable={exportable}
        exportConfig={exportConfig}
        exportToCSV={exportToCSV}
        exportToExcel={exportToExcel}
        exportToPDF={exportToPDF}
        handlePrint={handlePrint}
        selectedRows={selectedRows}
        clearSelection={clearSelection}
        bulkActions={bulkActions}
        getSelectedData={getSelectedData}
        showAddButton={showAddButton}
        createHandler={createHandler}
        addButtonLabel={addButtonLabel}
        setIsAddFormOpen={(open) => {
          if (open) {
            updateDialogState("add");
          } else {
            closeDialog();
          }
        }}
      />

      {/* Table Content */}
      {isMobile ? (
        <MobileCardView
          data={data}
          isPending={isPending}
          table={table}
          selectedRows={selectedRows}
          rowIdField={rowIdField}
          selectable={selectable}
          updateHandler={updateHandler}
          deleteHandler={deleteHandler}
          showEditButton={showEditButton}
          showDeleteButton={showDeleteButton}
          toggleRowSelection={toggleRowSelection}
          handleViewRow={handleViewRow}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          columns={columns}
        />
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
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
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
                  <TableCell
                    colSpan={finalColumns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Loading...
                      </span>
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={finalColumns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        No results found
                      </span>
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

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex flex-col sm:flex-row items-center gap-4 order-2 sm:order-1 w-full sm:w-auto">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            {pagination.totalCount !== undefined &&
              pagination.totalCount > 0 ? (
              <span>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {startRecord}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">{endRecord}</span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {pagination.totalCount}
                </span>{" "}
                results
              </span>
            ) : (
              <span>No results</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Rows:
            </span>
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
            disabled={currentPage === 1 || isPending}
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

      {/* Dialogs */}
      <FormDialog
        open={isAddFormOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        title={`Add New ${viewerTitle}`}
        description="Fill in the information below to create a new record"
        fields={formFields}
        onSubmit={handleCreate}
        submitLabel="Create"
        isLoading={isSubmitting}
        customForm={customAddForm}
      />

      <FormDialog
        open={isEditFormOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        title={`Edit ${viewerTitle}`}
        description="Update the information below"
        fields={formFields}
        onSubmit={handleUpdate}
        submitLabel="Update"
        isLoading={isSubmitting}
        defaultValues={editingRecord || undefined}
        customForm={customEditForm ? customEditForm(editingRecord!) : undefined}
      />

      <AlertDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {renderRowViewer ? (
        viewerOpen && viewerData && renderRowViewer(viewerData, closeDialog)
      ) : (
        <RowViewerDialog
          open={viewerOpen}
          onOpenChange={(open) => {
            if (!open) closeDialog();
          }}
          data={viewerData}
          title={viewerTitle}
          subtitle={viewerSubtitle}
          fieldConfig={viewerFieldConfig}
          customContent={customRowViewer}
        />
      )}
    </div>
  );
}
