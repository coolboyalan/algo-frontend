'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { SortingState, VisibilityState } from '@tanstack/react-table';
import { TableFilter, TableParams, TableResponse } from '@/app/actions/table-data';

interface UseTableStateProps<T> {
  initialData: TableResponse<T>;
  fetchData: (params: TableParams) => Promise<TableResponse<T>>;
  tableKey: string;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  pageSize: number;
  searchFields: string[];
}

export function useTableState<T extends Record<string, any>>({
  initialData,
  fetchData,
  tableKey,
  defaultSortBy,
  defaultSortOrder = 'asc',
  pageSize,
  searchFields,
}: UseTableStateProps<T>) {
  // Data & Pagination
  const [data, setData] = useState<T[]>(initialData.data);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Search & Filters
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<TableFilter[]>([]);

  // Sorting
  const [sorting, setSorting] = useState<SortingState>(
    defaultSortBy ? [{ id: defaultSortBy, desc: defaultSortOrder === 'desc' }] : []
  );

  // Selection
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Loading
  const [isPending, startTransition] = useTransition();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Refs for tracking changes
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const hasSearchChanged = useRef(false);
  const hasFiltersChanged = useRef(false);
  const hasSortingChanged = useRef(false);

  // Column visibility
  const storageKey = `table-column-visibility-${tableKey}`;

  const getInitialColumnVisibility = (): VisibilityState => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getInitialColumnVisibility
  );

  // Save column visibility to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(columnVisibility));
      } catch (error) {
        console.error('Failed to save column visibility:', error);
      }
    }
  }, [columnVisibility, storageKey]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      hasSearchChanged.current = true;
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]);

  // Fetch data when search, filters, or sorting changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const shouldResetToFirstPage =
      hasSearchChanged.current || hasFiltersChanged.current || hasSortingChanged.current;

    if (shouldResetToFirstPage) {
      setCurrentPage(1);
      performFetch(undefined, 1);
      hasSearchChanged.current = false;
      hasFiltersChanged.current = false;
      hasSortingChanged.current = false;
    }
  }, [debouncedSearch, activeFilters, sorting]);

  // Fetch function
  const performFetch = (cursor: string | undefined, targetPage: number) => {
    startTransition(async () => {
      try {
        const params: TableParams = {
          limit: currentPageSize,
          sortBy: sorting[0]?.id,
          sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
          cursor,
          search: debouncedSearch || undefined,
          searchFields: searchFields.length > 0 ? searchFields : undefined,
          filters: activeFilters.length > 0 ? activeFilters : undefined,
        };

        const result = await fetchData(params);
        setData(result.data);
        setPagination(result.pagination);
        setCurrentPage(targetPage);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    });
  };

  // Filter handlers
  const handleFilterChange = (field: string, value: string) => {
    if (value === 'all') {
      setActiveFilters((prev) => prev.filter((f) => f.field !== field));
    } else {
      setActiveFilters((prev) => {
        const existing = prev.filter((f) => f.field !== field);
        return [...existing, { field, value, operator: 'equals' }];
      });
    }
    hasFiltersChanged.current = true;
  };

  const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
    setActiveFilters((prev) => {
      if (checked) {
        return [...prev, { field, value, operator: 'equals' }];
      } else {
        return prev.filter((f) => !(f.field === field && f.value === value));
      }
    });
    hasFiltersChanged.current = true;
  };

  const getSelectedValues = (field: string): string[] => {
    return activeFilters.filter((f) => f.field === field).map((f) => f.value);
  };

  const removeFilter = (field: string, value?: string) => {
    if (value) {
      setActiveFilters((prev) => prev.filter((f) => !(f.field === field && f.value === value)));
    } else {
      setActiveFilters((prev) => prev.filter((f) => f.field !== field));
    }
    hasFiltersChanged.current = true;
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    hasFiltersChanged.current = true;
  };

  return {
    // Data
    data,
    setData,
    pagination,
    setPagination,
    currentPage,
    setCurrentPage,
    currentPageSize,
    setCurrentPageSize,

    // Search
    searchInput,
    setSearchInput,
    debouncedSearch,

    // Filters
    activeFilters,
    handleFilterChange,
    handleMultiSelectChange,
    getSelectedValues,
    removeFilter,
    clearAllFilters,

    // Sorting
    sorting,
    setSorting: (updater: any) => {
      setSorting(updater);
      hasSortingChanged.current = true;
    },

    // Selection
    selectedRows,
    setSelectedRows,

    // Column Visibility
    columnVisibility,
    setColumnVisibility,

    // Loading
    isPending,

    // Mobile
    isMobile,

    // Functions
    performFetch,
  };
}
