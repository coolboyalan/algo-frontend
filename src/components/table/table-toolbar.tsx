'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  Settings2,
  Plus,
} from 'lucide-react';
import { TableFilter } from '@/app/actions/table-data';
import { cn } from '@/lib/utils';

interface TableToolbarProps<T> {
  // Search
  searchable: boolean;
  searchPlaceholder: string;
  searchInput: string;
  setSearchInput: (value: string) => void;

  // Filters
  filters: {
    field: string;
    label: string;
    type: 'select' | 'multiselect';
    options?: { label: string; value: string }[];
  }[];
  activeFilters: TableFilter[];
  handleFilterChange: (field: string, value: string) => void;
  handleMultiSelectChange: (field: string, value: string, checked: boolean) => void;
  getSelectedValues: (field: string) => string[];
  removeFilter: (field: string, value?: string) => void;
  clearAllFilters: () => void;

  // Column Visibility
  table: any;

  // Export
  exportable: boolean;
  exportConfig: {
    csv?: boolean;
    excel?: boolean;
    pdf?: boolean;
    print?: boolean;
  };
  exportToCSV: (selectedOnly: boolean) => void;
  exportToExcel: (selectedOnly: boolean) => void;
  exportToPDF: (selectedOnly: boolean) => void;
  handlePrint: (selectedOnly: boolean) => void;

  // Bulk Actions
  selectedRows: Set<string>;
  clearSelection: () => void;
  bulkActions: {
    label: string;
    icon?: React.ReactNode;
    onClick: (selectedRows: any[]) => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  }[];
  getSelectedData: () => T[];

  // Add Button
  showAddButton: boolean;
  createHandler?: any;
  addButtonLabel: string;
  setIsAddFormOpen: (open: boolean) => void;
}

export function TableToolbar<T extends Record<string, any>>({
  searchable,
  searchPlaceholder,
  searchInput,
  setSearchInput,
  filters,
  activeFilters,
  handleFilterChange,
  handleMultiSelectChange,
  getSelectedValues,
  removeFilter,
  clearAllFilters,
  table,
  exportable,
  exportConfig,
  exportToCSV,
  exportToExcel,
  exportToPDF,
  handlePrint,
  selectedRows,
  clearSelection,
  bulkActions,
  getSelectedData,
  showAddButton,
  createHandler,
  addButtonLabel,
  setIsAddFormOpen,
}: TableToolbarProps<T>) {
  return (
    <div className="space-y-4">
      {/* Top Row: Add Button, Search, Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
          {showAddButton && createHandler && (
            <Button onClick={() => setIsAddFormOpen(true)} className="gap-2" size="default">
              <Plus className="h-4 w-4" />
              {addButtonLabel}
            </Button>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 sm:justify-end">
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
                    onClick={() => setSearchInput('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            <div className="flex gap-2">
              {/* Column Visibility */}
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
                          (column: any) =>
                            typeof column.accessorFn !== 'undefined' && column.getCanHide()
                        )
                        .map((column: any) => {
                          return (
                            <div
                              key={column.id}
                              className="flex items-center gap-2 p-2 hover:bg-muted rounded-sm cursor-pointer"
                              onClick={() => column.toggleVisibility(!column.getIsVisible())}
                            >
                              <Checkbox
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                              />
                              <span className="text-sm capitalize">
                                {column.id.replace(/([A-Z])/g, ' $1').trim()}
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

              {/* Export */}
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
        </div>

        {/* Filters Row */}
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => {
              const selectedValues = getSelectedValues(filter.field);
              const hasSelection = selectedValues.length > 0;

              if (filter.type === 'multiselect') {
                return (
                  <Popover key={filter.field}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn('h-9 gap-2', hasSelection && 'border-primary bg-primary/5')}
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
                                handleMultiSelectChange(filter.field, option.value, !isChecked)
                              }
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                  handleMultiSelectChange(filter.field, option.value, checked as boolean)
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
                    value={activeFilters.find((f) => f.field === filter.field)?.value || 'all'}
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

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex items-start gap-2 flex-wrap p-3 bg-muted/30 rounded-lg border border-dashed">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap mt-0.5">Active:</span>
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
                    <Badge key={`${field}-${values[0]}`} variant="secondary" className="gap-1 pl-2 pr-1">
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

      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-primary/10 border border-primary rounded-lg">
          <div className="flex items-center gap-3">
            <Checkbox checked={true} className="pointer-events-none" />
            <span className="font-medium">
              {selectedRows.size} {selectedRows.size === 1 ? 'row' : 'rows'} selected
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
                variant={action.variant || 'outline'}
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
    </div>
  );
}
