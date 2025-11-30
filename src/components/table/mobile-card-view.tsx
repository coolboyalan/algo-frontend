"use client";

import { flexRender } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Pencil, Trash2, Loader2, Search } from "lucide-react";

interface MobileCardViewProps<T> {
  data: T[];
  isPending: boolean;
  table: any;
  selectedRows: Set<string>;
  rowIdField: string;
  selectable: boolean;
  updateHandler?: any;
  deleteHandler?: any;
  showEditButton: boolean;
  showDeleteButton: boolean;
  toggleRowSelection: (id: string) => void;
  handleViewRow: (row: T) => void;
  handleEditClick: (row: T) => void;
  handleDeleteClick: (row: T) => void;
  columns: any[];
}

export function MobileCardView<T extends Record<string, any>>({
  data,
  isPending,
  table,
  selectedRows,
  rowIdField,
  selectable,
  updateHandler,
  deleteHandler,
  showEditButton,
  showDeleteButton,
  toggleRowSelection,
  handleViewRow,
  handleEditClick,
  handleDeleteClick,
  columns,
}: MobileCardViewProps<T>) {
  return (
    <div className="space-y-3">
      {isPending ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      ) : data.length > 0 ? (
        data.map((row, idx) => (
          <Card
            key={idx}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow py-2"
            // onClick={() => handleViewRow(row)}
          >
            <CardContent className="px-2.5">
              {/* Compact header with ID and actions */}
              <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b">
                <div className="flex items-center gap-2 min-w-0">
                  {selectable && (
                    <Checkbox
                      checked={selectedRows.has(String(row[rowIdField]))}
                      onCheckedChange={() =>
                        toggleRowSelection(String(row[rowIdField]))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <span className="text-xs font-mono font-semibold text-muted-foreground truncate">
                    #{String(row[rowIdField])}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-0.5 shrink-0">
                  {/* View button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewRow(row);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>

                  {/* Edit button */}
                  {updateHandler && showEditButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(row);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}

                  {/* Delete button */}
                  {deleteHandler && showDeleteButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(row);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}

                  {/* Custom actions from column - rendered directly inline */}
                  {(() => {
                    const actionsCol = columns.find(
                      (col) => col.id === "actions",
                    );
                    if (actionsCol?.cell) {
                      return (
                        <div
                          className="flex items-center gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {actionsCol.cell({ row: { original: row } } as any)}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* Content area */}
              <div className="space-y-1.5">
                {table
                  .getAllColumns()
                  .filter(
                    (col: any) =>
                      col.getIsVisible() &&
                      col.id !== "select" &&
                      col.id !== "actions",
                  )
                  .map((col: any) => {
                    const value = row[col.id as keyof T];
                    return (
                      <div key={col.id} className="flex items-start gap-3">
                        <span className="text-xs font-medium text-muted-foreground uppercase min-w-[100px] shrink-0">
                          {String(col.columnDef.header)}
                        </span>
                        <div className="text-sm font-medium text-left flex-1 truncate min-w-0">
                          {col.columnDef.cell ? (
                            <div className="truncate">
                              {flexRender(col.columnDef.cell, {
                                row: { original: row } as any,
                                getValue: () => value,
                              } as any)}
                            </div>
                          ) : (
                            <span className="truncate block">
                              {value !== null && value !== undefined
                                ? String(value)
                                : "-"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Search className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium">No results found</span>
        </div>
      )}
    </div>
  );
}
