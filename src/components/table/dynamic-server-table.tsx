'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  ChevronDown
} from 'lucide-react';
import { TableParams, TableResponse, TableFilter } from '@/app/actions/table-data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
    type: 'select' | 'multiselect';
    options?: { label: string; value: string }[];
  }[];
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  pageSize?: number;
  onRowClick?: (row: T) => void;
}

export function DynamicServerTable<T>({
  initialData,
  columns,
  fetchData,
  searchable = true,
  searchPlaceholder = 'Search...',
  searchFields = [],
  filters = [],
  defaultSortBy,
  defaultSortOrder = 'asc',
  pageSize = 10,
  onRowClick,
}: DynamicServerTableProps<T>) {
  const [data, setData] = useState<T[]>(initialData.data);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<TableFilter[]>([]);
  const [sorting, setSorting] = useState<SortingState>(
    defaultSortBy ? [{ id: defaultSortBy, desc: defaultSortOrder === 'desc' }] : []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const isFirstRender = useRef(true);
  const hasSearchChanged = useRef(false);
  const hasFiltersChanged = useRef(false);
  const hasSortingChanged = useRef(false);

  // Fetch function
  const performFetch = (cursor?: string, pageNum?: number) => {
    startTransition(async () => {
      try {
        const params: TableParams = {
          cursor: cursor || undefined,
          limit: pageSize,
          sortBy: sorting[0]?.id || defaultSortBy,
          sortOrder: sorting[0]?.desc ? 'desc' : defaultSortOrder,
          searchQuery: debouncedSearch || undefined,
          searchFields: searchFields.length > 0 ? searchFields : undefined,
          filters: activeFilters.length > 0 ? activeFilters : undefined,
        };

        const result = await fetchData(params);
        setData(result.data);
        setPagination(result.pagination);
        if (pageNum !== undefined) setCurrentPage(pageNum);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });
  };

  // Debounce search input
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

  // Search changed - fetch
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (hasSearchChanged.current) {
      hasSearchChanged.current = false;
      setCursorHistory([]);
      performFetch(undefined, 1);
    }
  }, [debouncedSearch]);

  // Filters changed - fetch
  useEffect(() => {
    if (hasFiltersChanged.current) {
      hasFiltersChanged.current = false;
      setCursorHistory([]);
      performFetch(undefined, 1);
    }
  }, [activeFilters]);

  // Sorting changed - fetch
  useEffect(() => {
    if (hasSortingChanged.current) {
      hasSortingChanged.current = false;
      setCursorHistory([]);
      performFetch(undefined, 1);
    }
  }, [sorting]);

  const handleNextPage = () => {
    if (!pagination.hasMore || !pagination.nextCursor) return;
    const newHistory = [...cursorHistory, pagination.nextCursor];
    setCursorHistory(newHistory);
    performFetch(pagination.nextCursor, currentPage + 1);
  };

  const handlePrevPage = () => {
    if (cursorHistory.length === 0) return;
    const newHistory = [...cursorHistory];
    newHistory.pop();
    const prevCursor = newHistory[newHistory.length - 1];
    setCursorHistory(newHistory);
    performFetch(prevCursor, currentPage - 1);
  };

  const handleFirstPage = () => {
    if (currentPage === 1) return;
    setCursorHistory([]);
    performFetch(undefined, 1);
  };

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = activeFilters.filter(f => f.field !== field);
    if (value && value !== 'all') {
      newFilters.push({ field, operator: 'equals', value });
    }
    hasFiltersChanged.current = true;
    setActiveFilters(newFilters);
  };

  const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
    const currentFieldFilters = activeFilters.filter(f => f.field === field);
    const otherFilters = activeFilters.filter(f => f.field !== field);
    hasFiltersChanged.current = true;
    if (checked) {
      setActiveFilters([...otherFilters, ...currentFieldFilters, { field, operator: 'equals', value }]);
    } else {
      setActiveFilters([...otherFilters, ...currentFieldFilters.filter(f => f.value !== value)]);
    }
  };

  const getSelectedValues = (field: string): string[] => {
    return activeFilters.filter(f => f.field === field).map(f => f.value);
  };

  const removeFilter = (field: string, value?: string) => {
    hasFiltersChanged.current = true;
    if (value) {
      setActiveFilters(activeFilters.filter(f => !(f.field === field && f.value === value)));
    } else {
      setActiveFilters(activeFilters.filter(f => f.field !== field));
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    onSortingChange: handleSortingChange,
    state: { sorting },
  });

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min((currentPage - 1) * pageSize + data.length, pagination.totalCount || 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {searchable && (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchInput && (
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6" onClick={() => setSearchInput('')}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

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

                if (filter.type === 'multiselect') {
                  return (
                    <Popover key={filter.field}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn("h-9 gap-2", hasSelection && "border-primary bg-primary/5")}>
                          <span>{filter.label}</span>
                          {hasSelection && <Badge variant="secondary" className="h-5 px-1.5 rounded-full">{selectedValues.length}</Badge>}
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-2" align="start">
                        <div className="space-y-1">
                          {filter.options?.map((option) => {
                            const isChecked = selectedValues.includes(option.value);
                            return (
                              <div key={option.value} className="flex items-center gap-2 p-2 hover:bg-muted rounded-sm cursor-pointer" onClick={() => handleMultiSelectChange(filter.field, option.value, !isChecked)}>
                                <Checkbox checked={isChecked} onCheckedChange={(checked) => handleMultiSelectChange(filter.field, option.value, checked as boolean)} />
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
                    <Select key={filter.field} value={activeFilters.find(f => f.field === filter.field)?.value || 'all'} onValueChange={(value) => handleFilterChange(filter.field, value)}>
                      <SelectTrigger className="h-9 w-[140px] sm:w-[160px]">
                        <SelectValue placeholder={filter.label} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All {filter.label}</SelectItem>
                        {filter.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap mt-0.5">Active:</span>
            <div className="flex flex-wrap gap-2 flex-1">
              {Object.entries(activeFilters.reduce((acc, filter) => {
                  if (!acc[filter.field]) acc[filter.field] = [];
                  acc[filter.field].push(filter.value);
                  return acc;
                }, {} as Record<string, string[]>)
              ).map(([field, values]) => {
                const filterConfig = filters.find(f => f.field === field);
                if (values.length === 1) {
                  const option = filterConfig?.options?.find(o => o.value === values[0]);
                  return (
                    <Badge key={`${field}-${values[0]}`} variant="secondary" className="gap-1 pl-2 pr-1">
                      <span className="font-medium">{filterConfig?.label}:</span>
                      <span>{option?.label || values[0]}</span>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent ml-1" onClick={() => removeFilter(field, values[0])}>
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                } else {
                  return (
                    <Badge key={field} variant="secondary" className="gap-1 pl-2 pr-1">
                      <span className="font-medium">{filterConfig?.label}:</span>
                      <span>{values.length} selected</span>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent ml-1" onClick={() => removeFilter(field)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                }
              })}
            </div>
            <Separator orientation="vertical" className="h-5" />
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs whitespace-nowrap">Clear all</Button>
          </div>
        )}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className={header.column.getCanSort() ? 'flex items-center gap-2 cursor-pointer select-none hover:text-foreground' : ''} onClick={header.column.getToggleSortingHandler()}>
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} onClick={() => onRowClick?.(row.original)} className={onRowClick ? 'cursor-pointer' : ''}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">No results found</span>
                    <span className="text-xs text-muted-foreground">Try adjusting your search or filters</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          {pagination.totalCount !== undefined && pagination.totalCount > 0 ? (
            <span>
              Showing <span className="font-medium text-foreground">{startRecord}</span> to{' '}
              <span className="font-medium text-foreground">{endRecord}</span> of{' '}
              <span className="font-medium text-foreground">{pagination.totalCount}</span> results
            </span>
          ) : (
            <span>No results</span>
          )}
        </div>

        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Button variant="outline" size="sm" onClick={handleFirstPage} disabled={currentPage === 1 || isPending} className="h-8 w-8 p-0">
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={cursorHistory.length === 0 || isPending} className="h-8 gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-2 px-3 py-1 border rounded-md bg-muted/50">
            <span className="text-sm font-medium">Page {currentPage}</span>
          </div>

          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!pagination.hasMore || isPending} className="h-8 gap-1">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
