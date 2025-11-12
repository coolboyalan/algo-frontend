"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  CalendarDays,
  Cross,
  XCircle,
  Eye,
  X,
  Edit3,
  Trash2,
  AlertTriangle,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  Link2,
} from "lucide-react";
import Modal from "@/components/Common/Modal";
import EditItemForm from "./EditItemForm";
import { useRouter } from "next/navigation";
import DashboardLayout from "../Layout/DashboardLayout";

// Dark theme configuration
const darkTheme = {
  background: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
  card: "bg-slate-800/90 border-slate-700/50 backdrop-blur-sm",
  cardHover: "hover:bg-slate-700/50",
  text: "text-slate-100",
  textMuted: "text-slate-400",
  textSecondary: "text-slate-300",
  primary: "bg-sky-600 hover:bg-sky-700 border-sky-500",
  secondary: "bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/50",
  success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  danger: "bg-red-500/20 text-red-400 border-red-500/30",
  warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  input:
    "bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400",
  table: "bg-slate-800/60 divide-slate-700",
  tableHeader: "bg-slate-900/80",
  tableRow: "hover:bg-slate-700/30",
};

// Utility functions
const getNestedValue = (obj, pathString) => {
  if (!obj || typeof pathString !== "string" || !pathString.trim())
    return undefined;
  return pathString.split(".").reduce((current, key) => current?.[key], obj);
};

const TableContentManager = ({
  apiEndpoint = "/api/default-endpoint",
  columns: initialColumns = [],
  filters = [],
  itemKeyField = "id",
  formFields = [],
  pageTitle = "Data Management",
  canAddItem = true,
  customLink,
  dynamicSelectDataSources = {},
  dynamicFilterOptionsData = {},
  customActions = [],
  mobileColumns = [],
  disableMobilePagination = false,
}) => {
  const router = useRouter();

  // Consolidated state
  const [state, setState] = useState({
    data: [],
    currentPage: 1,
    itemsPerPage: 10,
    sortConfig: { key: null, direction: "asc" },
    searchTerm: "",
    searchColumn: "id",
    activeFilters: {},
    showFilters: false,
    dateRange: { start: null, end: null },
    totalServerItems: 0,
    isLoading: false,
    error: null,
    notification: { type: "", message: "" },
    isMobile: false,
    // Modal states
    isViewModalOpen: false,
    isEditModalOpen: false,
    isCreateModalOpen: false,
    isDeleteModalOpen: false,
    selectedItem: null,
  });

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (typeof window !== "undefined" && window.NEXT_PUBLIC_API_BASE_URL) ||
    "";

  // Mobile detection
  useEffect(() => {
    const checkMobile = () =>
      updateState({ isMobile: window.innerWidth < 768 });
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Default mobile columns
  if (!mobileColumns.length) {
    mobileColumns = initialColumns.map((col) => col.key);
  }

  // API helper
  const makeApiCall = async (endpointSuffix, method = "GET", body = null) => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const requestBody =
      body && (method === "POST" || method === "PUT")
        ? Object.fromEntries(
            Object.entries(body).filter(
              ([_, value]) =>
                value !== null && value !== undefined && value !== "",
            ),
          )
        : body;

    try {
      const response = await fetch(`${baseUrl}${endpointSuffix}`, {
        method,
        headers,
        ...(requestBody && { body: JSON.stringify(requestBody) }),
      });

      const responseBody = await response.json().catch(() => response.text());
      if (!response.ok) {
        const errorMessage =
          responseBody?.message ||
          responseBody ||
          `Operation failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      return responseBody;
    } catch (error) {
      console.error(`API call failed for ${method} ${endpointSuffix}:`, error);
      throw error;
    }
  };

  // Data fetching
  const fetchData = useCallback(async () => {
    updateState({ isLoading: true, error: null });

    const params = new URLSearchParams({
      page: state.currentPage,
      limit: state.itemsPerPage,
      ...(state.sortConfig.key && {
        sortBy: state.sortConfig.key,
        sortOrder: state.sortConfig.direction,
      }),
      ...(state.searchTerm && {
        search: state.searchTerm,
        ...(state.searchColumn !== "all" && { searchIn: state.searchColumn }),
      }),
      ...(state.dateRange.start && { startDate: state.dateRange.start }),
      ...(state.dateRange.end && { endDate: state.dateRange.end }),
      ...Object.fromEntries(
        Object.entries(state.activeFilters).filter(
          ([_, value]) =>
            value !== null && value !== undefined && String(value).trim(),
        ),
      ),
    });

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${baseUrl}${apiEndpoint}?${params}`, {
        headers,
      });
      const result = await response.json().catch(() => {
        throw new Error(response.text());
      });

      if (!response.ok) {
        throw new Error(
          result.message || `Failed to fetch data (status: ${response.status})`,
        );
      }

      updateState({
        data: result?.data?.result || [],
        totalServerItems: result?.data?.pagination?.totalItems || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error("Fetch error:", error);
      updateState({
        error: error.message || "Failed to load data.",
        data: [],
        totalServerItems: 0,
        isLoading: false,
        notification: {
          type: "error",
          message: error.message || "Failed to load data.",
        },
      });
    }
  }, [
    apiEndpoint,
    baseUrl,
    state.currentPage,
    state.itemsPerPage,
    state.sortConfig,
    state.searchTerm,
    state.searchColumn,
    state.activeFilters,
    state.dateRange,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Event handlers
  const handleCustomAction = async (item, action) => {
    if (!action.actionUrl) return;
    updateState({ isLoading: true });

    try {
      const result = await makeApiCall(
        `${action.actionUrl}/${item[itemKeyField]}`,
        action.method || "PUT",
        action.payload || {},
      );
      updateState({
        notification: {
          type: "success",
          message:
            result.message ||
            action.successMessage ||
            "Action completed successfully!",
        },
        isLoading: false,
      });
      fetchData();
    } catch (error) {
      updateState({
        notification: {
          type: "error",
          message:
            error.message || action.errorMessage || "Failed to perform action",
        },
        isLoading: false,
      });
    }
  };

  const handleCustomLink = async (item) => {
    try {
      const response = await fetch(`${baseUrl}/api/broker/${item.brokerId}`);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (!data.data) {
        alert("Please add broker first");
        return;
      }
      router.push(item.loginUrl);
    } catch (error) {
      alert("Unable to login, Internal Error");
    }
  };

  // Modal handlers
  const modalHandlers = {
    view: (item) => updateState({ selectedItem: item, isViewModalOpen: true }),
    edit: (item) => updateState({ selectedItem: item, isEditModalOpen: true }),
    delete: (item) =>
      updateState({ selectedItem: item, isDeleteModalOpen: true }),
    create: () => updateState({ selectedItem: null, isCreateModalOpen: true }),
  };

  // CRUD operations
  const handleCreateSubmit = async (newItemData) => {
    updateState({ isLoading: true });
    try {
      const result = await makeApiCall(apiEndpoint, "POST", newItemData);
      updateState({
        notification: {
          type: "success",
          message: result.message || "Item created successfully!",
        },
        isCreateModalOpen: false,
        isLoading: false,
      });
      fetchData();
    } catch (error) {
      updateState({
        notification: {
          type: "error",
          message: error.message || "Failed to create item.",
        },
        isLoading: false,
      });
    }
  };

  const handleSaveEdit = async (editedItem) => {
    if (!state.selectedItem?.[itemKeyField]) {
      updateState({
        notification: {
          type: "error",
          message: "No item selected or item has no ID.",
        },
      });
      return;
    }

    updateState({ isLoading: true });
    try {
      const result = await makeApiCall(
        `${apiEndpoint}/${state.selectedItem[itemKeyField]}`,
        "PUT",
      );
      updateState({
        notification: {
          type: "success",
          message: result.message || "Item updated successfully!",
        },
        isEditModalOpen: false,
        selectedItem: null,
        isLoading: false,
      });
      fetchData();
    } catch (error) {
      updateState({
        notification: {
          type: "error",
          message: error.message || "Failed to update item.",
        },
        isLoading: false,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!state.selectedItem?.[itemKeyField]) {
      updateState({
        notification: {
          type: "error",
          message: "No item selected or item has no ID.",
        },
      });
      return;
    }

    updateState({ isLoading: true });
    try {
      const result = await makeApiCall(
        `${apiEndpoint}/${state.selectedItem[itemKeyField]}`,
        "DELETE",
      );
      updateState({
        notification: {
          type: "success",
          message: result.message || "Item deleted successfully!",
        },
        isDeleteModalOpen: false,
        selectedItem: null,
        isLoading: false,
      });
      fetchData();
    } catch (error) {
      updateState({
        notification: {
          type: "error",
          message: error.message || "Failed to delete item.",
        },
        isLoading: false,
      });
    }
  };

  // Filter and search handlers
  const handleSearchTermChange = (newSearchTerm) => {
    updateState({ searchTerm: newSearchTerm, currentPage: 1 });
  };

  const handleFilterChange = (key, value) => {
    updateState({
      activeFilters: {
        ...state.activeFilters,
        [key]: value === "all" || value === "" ? null : value,
      },
      currentPage: 1,
    });
  };

  const handleClearAllFilters = () => {
    updateState({
      searchTerm: "",
      searchColumn: "all",
      activeFilters: {},
      dateRange: { start: null, end: null },
      sortConfig: { key: null, direction: "asc" },
      currentPage: 1,
    });
  };

  // Table configuration
  const tableColumns = [
    ...initialColumns.map((col) => ({
      ...col,
      showOnMobile: mobileColumns.includes(col.key),
    })),
    {
      key: "actions",
      label: "Actions",
      type: "actions",
      sortable: false,
      showOnMobile: true,
    },
  ];

  // Cell renderer
  const renderCell = (item, column) => {
    if (column.render) return column.render(item, column);

    if (column.type === "actions") {
      return (
        <div className="flex items-center space-x-1.5">
          {customLink && (
            <button
              onClick={() => handleCustomLink(item)}
              className="text-sky-400 hover:text-sky-300 p-1.5 rounded hover:bg-sky-500/20 transition-colors"
              title="Link"
            >
              <Link2 size={16} />
            </button>
          )}
          <button
            onClick={() => modalHandlers.view(item)}
            className="text-cyan-400 hover:text-cyan-300 p-1.5 rounded hover:bg-cyan-500/20 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => modalHandlers.edit(item)}
            className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded hover:bg-emerald-500/20 transition-colors"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => modalHandlers.delete(item)}
            className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-500/20 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
          {customActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleCustomAction(item, action)}
              className={`${action.color || "text-slate-400 hover:text-slate-300"} ${action.bgColor || "hover:bg-slate-600/50"} p-1.5 rounded transition-colors`}
              title={action.title}
            >
              {action.icon || <Cross size={16} />}
            </button>
          ))}
        </div>
      );
    }

    const value = getNestedValue(item, column.key);

    if (column.type === "enum") {
      const enumConfig = column.enumConfig?.find(
        (e) => String(e.value) === String(value),
      );
      return (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            enumConfig?.bgColor || "bg-slate-600/50"
          } ${enumConfig?.textColor || "text-slate-300"}`}
        >
          {enumConfig?.display ||
            (value !== null && value !== undefined ? String(value) : "")}
        </span>
      );
    }

    if (column.type === "direction") {
      return (
        <span
          className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            value === "long"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {value === "long" ? (
            <ArrowUp size={14} className="mr-1" />
          ) : (
            <ArrowDown size={14} className="mr-1" />
          )}
          {String(value)}
        </span>
      );
    }

    if (column.type === "date" && value) {
      try {
        return (
          <div className="text-sm text-slate-300 whitespace-nowrap">
            {new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        );
      } catch {
        return <div className="text-sm text-red-400">Invalid Date</div>;
      }
    }

    if (
      column.type === "currency" &&
      (typeof value === "number" ||
        (value !== null &&
          value !== undefined &&
          !isNaN(parseFloat(String(value)))))
    ) {
      return (
        <div className="text-sm font-medium text-slate-200 whitespace-nowrap">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: column.currency || "USD",
          }).format(Number(value))}
        </div>
      );
    }

    const displayValue =
      value === null || value === undefined
        ? ""
        : typeof value === "object"
          ? JSON.stringify(value)
          : String(value);

    return (
      <div
        className="text-sm text-slate-300 whitespace-nowrap truncate"
        title={displayValue}
      >
        {displayValue}
      </div>
    );
  };

  // Pagination helpers
  const totalPages =
    state.totalServerItems > 0
      ? Math.ceil(state.totalServerItems / state.itemsPerPage)
      : 0;
  const firstItemIndex =
    state.data.length > 0
      ? (state.currentPage - 1) * state.itemsPerPage + 1
      : 0;
  const lastItemIndex =
    (state.currentPage - 1) * state.itemsPerPage + state.data.length;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (!totalPages || totalPages <= 0) return [];
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let leftBound = Math.max(
        1,
        state.currentPage - Math.floor(maxVisible / 2),
      );
      let rightBound = Math.min(totalPages, leftBound + maxVisible - 1);

      if (rightBound - leftBound + 1 < maxVisible) {
        leftBound =
          rightBound === totalPages
            ? Math.max(1, rightBound - maxVisible + 1)
            : leftBound;
      }

      if (leftBound > 1) {
        pages.push(1);
        if (leftBound > 2) pages.push("...");
      }

      for (let i = leftBound; i <= rightBound; i++) pages.push(i);

      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <DashboardLayout>
      <div className={`${darkTheme.background} min-h-screen p-4 sm:p-6`}>
        <div
          className={`${darkTheme.card} shadow-xl rounded-xl border overflow-hidden`}
        >
          {/* Header Section */}
          <div className="px-6 py-4 border-b border-slate-700/50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-grow max-w-lg">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <select
                  value={state.searchColumn}
                  onChange={(e) =>
                    updateState({ searchColumn: e.target.value })
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-sm text-slate-400 focus:ring-0"
                >
                  {initialColumns
                    .filter(
                      (c) => c.searchable !== false && c.type !== "actions",
                    )
                    .map((col) => (
                      <option key={col.key} value={col.key}>
                        {col.label}
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  value={state.searchTerm}
                  onChange={(e) => handleSearchTermChange(e.target.value)}
                  className={`${darkTheme.input} pl-10 pr-32 py-2.5 w-full rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 flex-wrap">
                {canAddItem && (
                  <button
                    onClick={modalHandlers.create}
                    className={`${darkTheme.primary} flex items-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-all text-white focus:ring-2 focus:ring-sky-300`}
                  >
                    <PlusCircle size={16} className="mr-2" /> Add New
                  </button>
                )}

                {filters?.length > 0 && (
                  <button
                    onClick={() =>
                      updateState({ showFilters: !state.showFilters })
                    }
                    className={`${state.showFilters ? darkTheme.primary : darkTheme.secondary} flex items-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${darkTheme.text}`}
                  >
                    <Filter size={16} className="mr-2" /> Filters
                  </button>
                )}

                {/* Date Range */}
                <div
                  className={`${darkTheme.secondary} flex items-center space-x-2 rounded-lg border px-3 py-2 my-2 text-sm transition-colors`}
                >
                  <CalendarDays size={16} className="text-slate-400" />
                  <input
                    type="date"
                    value={state.dateRange.start || ""}
                    onChange={(e) =>
                      updateState({
                        dateRange: {
                          ...state.dateRange,
                          start: e.target.value,
                        },
                        currentPage: 1,
                      })
                    }
                    className="bg-transparent border-none focus:ring-0 text-sm text-slate-300 w-28"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="date"
                    value={state.dateRange.end || ""}
                    onChange={(e) =>
                      updateState({
                        dateRange: { ...state.dateRange, end: e.target.value },
                        currentPage: 1,
                      })
                    }
                    className="bg-transparent border-none focus:ring-0 text-sm text-slate-300 w-28"
                  />
                  {(state.dateRange.start || state.dateRange.end) && (
                    <button
                      onClick={() =>
                        updateState({
                          dateRange: { start: null, end: null },
                          currentPage: 1,
                        })
                      }
                      className="text-slate-400 hover:text-slate-300"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filters Section */}
            {state.showFilters && filters?.length > 0 && (
              <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-300 text-xs uppercase tracking-wider">
                    Filter by:
                  </h3>
                  <button
                    onClick={() => updateState({ showFilters: false })}
                    className="text-slate-400 hover:text-slate-300"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filters.map((filter) => (
                    <div key={filter.key}>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        {filter.label}
                      </label>
                      {filter.type === "boolean" ? (
                        <select
                          value={state.activeFilters[filter.key] ?? "all"}
                          onChange={(e) =>
                            handleFilterChange(
                              filter.key,
                              e.target.value === "all"
                                ? null
                                : e.target.value === "true",
                            )
                          }
                          className={`${darkTheme.input} w-full rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-sky-500`}
                        >
                          <option value="all">All</option>
                          <option value="true">
                            {filter.trueLabel || "True"}
                          </option>
                          <option value="false">
                            {filter.falseLabel || "False"}
                          </option>
                        </select>
                      ) : filter.type === "select" ? (
                        <select
                          value={state.activeFilters[filter.key] || "all"}
                          onChange={(e) =>
                            handleFilterChange(filter.key, e.target.value)
                          }
                          className={`${darkTheme.input} w-full rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-sky-500`}
                        >
                          <option value="all">All {filter.label}</option>
                          {(
                            (filter.optionsSourceKey &&
                              dynamicFilterOptionsData?.[
                                filter.optionsSourceKey
                              ]) ||
                            filter.options ||
                            []
                          ).map((option) => (
                            <option
                              key={option[filter.optionValueKey || "value"]}
                              value={option[filter.optionValueKey || "value"]}
                            >
                              {option[filter.optionLabelKey || "label"]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={
                            filter.type === "number"
                              ? "number"
                              : filter.type === "date"
                                ? "date"
                                : "text"
                          }
                          placeholder={`${filter.label}...`}
                          value={state.activeFilters[filter.key] || ""}
                          onChange={(e) =>
                            handleFilterChange(filter.key, e.target.value)
                          }
                          className={`${darkTheme.input} w-full rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-sky-500`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notification */}
          {state.notification.message && (
            <div
              className={`px-6 py-3 border-b text-sm font-medium transition-opacity ${
                state.notification.type === "success"
                  ? darkTheme.success
                  : state.notification.type === "error"
                    ? darkTheme.danger
                    : darkTheme.warning
              }`}
            >
              {state.notification.message}
              <button
                onClick={() =>
                  updateState({ notification: { type: "", message: "" } })
                }
                className="float-right font-bold text-lg leading-none hover:opacity-70"
              >
                &times;
              </button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${darkTheme.table}`}>
              <thead className={`${darkTheme.tableHeader} sticky top-0 z-10`}>
                <tr>
                  {tableColumns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-semibold ${darkTheme.textMuted} uppercase tracking-wider group whitespace-nowrap ${
                        column.showOnMobile ? "" : "hidden sm:table-cell"
                      }`}
                      onClick={() => {
                        if (column.sortable !== false) {
                          const direction =
                            state.sortConfig.key === column.key &&
                            state.sortConfig.direction === "asc"
                              ? "desc"
                              : "asc";
                          updateState({
                            sortConfig: { key: column.key, direction },
                            currentPage: 1,
                          });
                        }
                      }}
                      style={{
                        cursor:
                          column.sortable !== false ? "pointer" : "default",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`${darkTheme.textSecondary} group-hover:text-slate-100`}
                        >
                          {column.label}
                        </span>
                        {state.sortConfig.key === column.key && (
                          <span className="ml-2 text-sky-400">
                            {state.sortConfig.direction === "asc" ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y divide-slate-700/50`}>
                {state.isLoading && state.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <svg
                          className="animate-spin h-8 w-8 text-sky-400 mb-3"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <p>Loading data...</p>
                      </div>
                    </td>
                  </tr>
                ) : state.error && state.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-red-400">
                        <XCircle size={32} className="mb-3" />
                        <p className="text-lg font-medium">
                          Error loading data
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {state.error}
                        </p>
                        <button
                          onClick={fetchData}
                          className="mt-4 px-4 py-2 bg-sky-500/20 text-sky-400 rounded-md text-sm font-medium hover:bg-sky-500/30"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : !state.isLoading && state.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Search size={32} className="mb-3" />
                        <p className="text-lg font-medium">
                          No matching records found
                        </p>
                        <button
                          onClick={handleClearAllFilters}
                          className="mt-3 px-4 py-2 bg-sky-500/20 text-sky-400 rounded-md text-sm font-medium hover:bg-sky-500/30"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  state.data.map((item) => (
                    <tr key={item[itemKeyField]} className={darkTheme.tableRow}>
                      {tableColumns.map((column) => (
                        <td
                          key={`${item[itemKeyField]}-${column.key}`}
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            column.showOnMobile ? "" : "hidden sm:table-cell"
                          }`}
                        >
                          {renderCell(item, column)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div
              className={`${darkTheme.card} border-t border-slate-700/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm`}
            >
              <div className="flex items-center space-x-4">
                <div className={darkTheme.textSecondary}>
                  Showing <span className="font-medium">{firstItemIndex}</span>{" "}
                  to <span className="font-medium">{lastItemIndex}</span> of{" "}
                  <span className="font-medium">{state.totalServerItems}</span>{" "}
                  results
                </div>
                <div className="flex items-center space-x-2">
                  <span className={darkTheme.textSecondary}>Rows:</span>
                  <select
                    value={state.itemsPerPage}
                    onChange={(e) =>
                      updateState({
                        itemsPerPage: Number(e.target.value),
                        currentPage: 1,
                      })
                    }
                    className={`${darkTheme.input} border rounded-md px-2 py-1 focus:ring-1 focus:ring-sky-500`}
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(!disableMobilePagination || !state.isMobile) && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() =>
                      updateState({
                        currentPage: Math.max(state.currentPage - 1, 1),
                      })
                    }
                    disabled={state.currentPage === 1 || state.isLoading}
                    className={`p-2 rounded-md border transition-colors ${
                      state.currentPage === 1 || state.isLoading
                        ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                        : `${darkTheme.secondary} ${darkTheme.textSecondary} hover:bg-slate-600/50`
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === "number"
                          ? updateState({ currentPage: page })
                          : null
                      }
                      disabled={page === "..." || state.isLoading}
                      className={`w-9 h-9 rounded-md flex items-center justify-center font-medium border transition-colors ${
                        page === state.currentPage
                          ? "bg-sky-600 text-white border-sky-500"
                          : `${darkTheme.secondary} ${darkTheme.textSecondary} hover:bg-slate-600/50`
                      } ${typeof page !== "number" || state.isLoading ? "pointer-events-none opacity-60" : ""}`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      updateState({
                        currentPage: Math.min(
                          state.currentPage + 1,
                          totalPages || 1,
                        ),
                      })
                    }
                    disabled={
                      state.currentPage === totalPages ||
                      totalPages === 0 ||
                      state.isLoading
                    }
                    className={`p-2 rounded-md border transition-colors ${
                      state.currentPage === totalPages ||
                      totalPages === 0 ||
                      state.isLoading
                        ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                        : `${darkTheme.secondary} ${darkTheme.textSecondary} hover:bg-slate-600/50`
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Modals */}
          <Modal
            isOpen={state.isViewModalOpen}
            onClose={() => updateState({ isViewModalOpen: false })}
            title={`View ${pageTitle.replace("Management", "").trim()} Details`}
          >
            {state.selectedItem && (
              <div className="space-y-3 text-sm">
                {initialColumns
                  .filter((col) => col.type !== "actions")
                  .map((col) => (
                    <div
                      key={col.key}
                      className="flex border-b border-slate-700/50 py-2.5 last:border-b-0"
                    >
                      <strong className="w-2/5 font-semibold text-slate-300">
                        {col.label}:
                      </strong>
                      <div className="w-3/5 text-slate-400 flex items-center">
                        {renderCell(state.selectedItem, col)}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Modal>

          {/* Edit Modal - UPDATED - Remove scrolling container */}
          <Modal
            isOpen={state.isEditModalOpen}
            onClose={() => updateState({ isEditModalOpen: false })}
            title={`Edit ${pageTitle.replace("Management", "").trim()}`}
            size="xl" // Changed to xl for more width
          >
            {state.selectedItem && formFields.length > 0 && (
              <EditItemForm
                item={state.selectedItem}
                formFields={formFields}
                onSubmit={handleSaveEdit}
                onCancel={() => updateState({ isEditModalOpen: false })}
                itemKeyField={itemKeyField}
                dynamicSelectOptions={dynamicSelectDataSources}
              />
            )}
          </Modal>

          {/* Create Modal - UPDATED - Remove scrolling container */}
          <Modal
            isOpen={state.isCreateModalOpen}
            onClose={() => updateState({ isCreateModalOpen: false })}
            title={`Create New ${pageTitle.replace("Management", "").trim()}`}
            size="xl" // Changed to xl for more width
          >
            {formFields.length > 0 && (
              <EditItemForm
                item={null}
                formFields={formFields}
                onSubmit={handleCreateSubmit}
                onCancel={() => updateState({ isCreateModalOpen: false })}
                itemKeyField={itemKeyField}
                dynamicSelectOptions={dynamicSelectDataSources}
              />
            )}
          </Modal>

          <Modal
            isOpen={state.isDeleteModalOpen}
            onClose={() => updateState({ isDeleteModalOpen: false })}
            title="Confirm Deletion"
            size="sm"
          >
            {state.selectedItem && (
              <div>
                <div className="flex items-center mb-4">
                  <AlertTriangle
                    size={24}
                    className="text-red-400 mr-3 flex-shrink-0"
                  />
                  <p className="text-slate-300 text-md">
                    Are you sure you want to delete this item? <br />
                    This action cannot be undone.
                  </p>
                </div>
                <div className="text-sm bg-slate-900/50 p-3 rounded-md mb-6 border border-slate-700/50">
                  <strong className="text-slate-300">Item ID:</strong>{" "}
                  <span className="text-slate-400">
                    {state.selectedItem[itemKeyField]}
                  </span>
                  {initialColumns.find(
                    (col) => col.key === "name" && state.selectedItem.name,
                  ) && (
                    <span className="text-slate-400">
                      {" "}
                      - {state.selectedItem.name}
                    </span>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => updateState({ isDeleteModalOpen: false })}
                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-600/50 rounded-md transition-colors focus:ring-2 focus:ring-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={state.isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center focus:ring-2 focus:ring-red-400 disabled:opacity-50"
                  >
                    {state.isLoading ? (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <Trash2 size={16} className="mr-2" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TableContentManager;
