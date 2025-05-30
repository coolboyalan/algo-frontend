// components/CrudTable/TableContentManager.js
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
  X,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  AlertTriangle,
  PlusCircle,
} from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout"; // Adjust path as needed
import Modal from "@/components/Common/Modal"; // Adjust path as needed
import EditItemForm from "./EditItemForm"; // Adjust path as needed

const TableContentManager = ({
  apiEndpoint = "/api/trade",
  columns: initialColumns = [],
  filters = [],
  itemKeyField = "id", // Unique key for items, default 'id'
  formFields = [], // Defines fields for the Edit/Create form
  pageTitle = "Data Table", // Title for the layout header
  canAddItem = true, // Prop to control visibility of "Add New" button
}) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [totalServerItems, setTotalServerItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: "" });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for create modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const baseUrl =
    (typeof process !== "undefined" &&
      process.env &&
      process.env.NEXT_PUBLIC_API_BASE_URL) ||
    (typeof window !== "undefined" && window.NEXT_PUBLIC_API_BASE_URL) ||
    "";

  const makeApiCall = async (endpoint, method = "GET", body = null) => {
    setIsLoading(true);
    setError(null);
    setNotification({ type: "", message: "" });
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => response.text());
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData?.message || errorData || "Operation failed"}`,
        );
      }
      return response.json();
    } catch (e) {
      console.error(`API call failed for ${method} ${endpoint}:`, e);
      setError(e.message || "An unknown error occurred");
      setNotification({
        type: "error",
        message: e.message || "An unknown error occurred",
      });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    // ... (fetchData logic remains the same)
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", itemsPerPage.toString());
    if (sortConfig.key) {
      params.append("sortBy", sortConfig.key);
      params.append("sortOrder", sortConfig.direction);
    }
    if (searchTerm) {
      params.append("search", searchTerm);
      if (searchColumn !== "all") params.append("searchIn", searchColumn);
    }
    if (dateRange.start) params.append("startDate", dateRange.start);
    if (dateRange.end) params.append("endDate", dateRange.end);
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value != null && String(value).trim() !== "")
        params.append(key, String(value));
    });

    const fullApiUrl = `${baseUrl}${apiEndpoint}?${params.toString()}`;
    try {
      const result = await makeApiCall(fullApiUrl, "GET");
      setData(result?.data?.result || []);
      setTotalServerItems(result?.data?.total || 0);
    } catch (e) {
      setData([]);
      setTotalServerItems(0);
    }
  }, [
    apiEndpoint,
    baseUrl,
    currentPage,
    itemsPerPage,
    sortConfig,
    searchTerm,
    searchColumn,
    activeFilters,
    dateRange,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };
  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setSelectedItem(null); // Clear selected item for create mode
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (newItemData) => {
    const createUrl = `${baseUrl}${apiEndpoint}`;
    try {
      const result = await makeApiCall(createUrl, "POST", newItemData);
      setNotification({
        type: "success",
        message: result.message || "Item created successfully!",
      });
      setIsCreateModalOpen(false);
      fetchData(); // Refresh data
    } catch (e) {
      // Notification already set by makeApiCall
    }
  };

  const handleSaveEdit = async (editedItem) => {
    // Check if we are editing an existing item or creating a new one (though create has its own modal now)
    if (!selectedItem || !selectedItem[itemKeyField]) {
      // This case should ideally be handled by directing to create flow if selectedItem is null
      setNotification({
        type: "error",
        message: "No item selected for update or item has no ID.",
      });
      return;
    }
    const itemId = selectedItem[itemKeyField];
    const updateUrl = `${baseUrl}${apiEndpoint}/${itemId}`;
    try {
      const result = await makeApiCall(updateUrl, "PUT", editedItem);
      setNotification({
        type: "success",
        message: result.message || "Item updated successfully!",
      });
      setIsEditModalOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (e) {
      // Notification already set
    }
  };

  const handleConfirmDelete = async () => {
    // ... (handleConfirmDelete logic remains the same)
    if (!selectedItem || !selectedItem[itemKeyField]) {
      setNotification({
        type: "error",
        message: "No item selected for deletion or item has no ID.",
      });
      return;
    }
    const itemId = selectedItem[itemKeyField];
    const deleteUrl = `${baseUrl}${apiEndpoint}/${itemId}`;
    try {
      const result = await makeApiCall(deleteUrl, "DELETE");
      setNotification({
        type: "success",
        message: result.message || "Item deleted successfully!",
      });
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (e) {
      // Notification already set
    }
  };

  const tableColumns = [
    /* ... (tableColumns logic remains the same) ... */ ...initialColumns,
    {
      key: "actions",
      label: "Actions",
      type: "actions",
      sortable: false,
    },
  ];

  const requestSort = (key) => {
    /* ... (requestSort logic remains the same) ... */
    const columnConfig = tableColumns.find((col) => col.key === key);
    if (columnConfig && columnConfig.sortable === false) return;

    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  const handleFilterChange = (key, value) => {
    /* ... */
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? null : value,
    }));
    setCurrentPage(1);
  };
  const clearDateRange = () => {
    /* ... */
    setDateRange({ start: null, end: null });
    setCurrentPage(1);
  };
  const handleSearchTermChange = (newSearchTerm) => {
    /* ... */
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };
  const handleSearchColumnChange = (newSearchColumn) => {
    /* ... */
    setSearchColumn(newSearchColumn);
    setCurrentPage(1);
  };
  const handleDateChange = (newDateRange) => {
    /* ... */
    setDateRange(newDateRange);
    setCurrentPage(1);
  };
  const handleClearAllFilters = () => {
    /* ... */
    setSearchTerm("");
    setSearchColumn("all");
    setActiveFilters({});
    setDateRange({ start: null, end: null });
    setSortConfig({ key: null, direction: "asc" });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalServerItems / itemsPerPage);
  const itemsOnCurrentPage = data.length;
  const firstItemIndexOnPage =
    itemsOnCurrentPage > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const lastItemIndexOnPage =
    (currentPage - 1) * itemsPerPage + itemsOnCurrentPage;

  const renderCell = (item, column) => {
    /* ... (renderCell logic remains the same) ... */
    const value = item[column.key];
    if (column.type === "actions") {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewItem(item)}
            className="text-blue-500 hover:text-blue-700 p-1"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEditItem(item)}
            className="text-green-500 hover:text-green-700 p-1"
            title="Edit"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => handleDeleteItem(item)}
            className="text-red-500 hover:text-red-700 p-1"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      );
    }
    if (column.type === "enum") {
      const enumConfig = column.enumConfig?.find((e) => e.value === value);
      return (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${enumConfig?.bgColor || "bg-gray-100"} ${enumConfig?.textColor || "text-gray-800"}`}
        >
          {enumConfig?.display || value}
        </span>
      );
    }
    if (column.type === "direction") {
      return (
        <span
          className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${value === "long" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {value === "long" ? (
            <ArrowUp size={14} className="mr-1" />
          ) : (
            <ArrowDown size={14} className="mr-1" />
          )}
          {value}
        </span>
      );
    }
    if (column.type === "date") {
      return (
        <div className="text-sm text-gray-700 whitespace-nowrap">
          {new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    }
    if (column.type === "currency") {
      return (
        <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: column.currency || "USD",
          }).format(value)}
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
      <div className="text-sm text-gray-700 whitespace-nowrap">
        {displayValue}
      </div>
    );
  };

  const getPageNumbers = () => {
    /* ... (getPageNumbers logic remains the same) ... */
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let leftBound = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      );
      let rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);
      if (rightBound - leftBound + 1 < maxVisiblePages) {
        if (leftBound === 1)
          rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);
        else if (rightBound === totalPages)
          leftBound = Math.max(1, rightBound - maxVisiblePages + 1);
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
    <DashboardLayout pageTitle={pageTitle}>
      <div className="bg-white shadow-md rounded-lg">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-grow max-w-xl">
              {/* Search input and column select */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <select
                  value={searchColumn}
                  onChange={(e) => handleSearchColumnChange(e.target.value)}
                  className="h-full bg-transparent border-none text-sm text-gray-500 focus:ring-0 pr-7 appearance-none"
                >
                  <option value="all">All Columns</option>
                  {initialColumns
                    .filter((c) => c.searchable !== false)
                    .map((column) => (
                      <option key={column.key} value={column.key}>
                        {column.label}
                      </option>
                    ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-28 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-3">
              {/* Add New Button */}
              {canAddItem && (
                <button
                  onClick={handleOpenCreateModal}
                  className="flex items-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-all bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 border-blue-500"
                >
                  <PlusCircle size={16} className="mr-2" /> Add New
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${showFilters ? "bg-blue-50 text-blue-600 border-blue-300" : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"}`}
              >
                <Filter size={16} className="mr-2" /> Filters
              </button>
              <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 transition-colors">
                {/* Date range inputs */}
                <CalendarDays size={16} className="text-gray-500" />
                <input
                  type="date"
                  className="bg-transparent border-none focus:ring-0 text-sm text-gray-700 w-28"
                  value={dateRange.start || ""}
                  onChange={(e) =>
                    handleDateChange({ ...dateRange, start: e.target.value })
                  }
                />
                <span className="text-gray-400 mx-1">to</span>
                <input
                  type="date"
                  className="bg-transparent border-none focus:ring-0 text-sm text-gray-700 w-28"
                  value={dateRange.end || ""}
                  onChange={(e) =>
                    handleDateChange({ ...dateRange, end: e.target.value })
                  }
                />
                {(dateRange.start || dateRange.end) && (
                  <button
                    onClick={clearDateRange}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Filter Panel */}
          {showFilters /* ... */ && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700 text-xs uppercase tracking-wider">
                  Filter by:
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filters.map((filter) => (
                  <div key={filter.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {filter.label}
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={activeFilters[filter.key] || "all"}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                    >
                      <option value="all">All {filter.label}</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Area */}
        {notification.message /* ... */ && (
          <div
            className={`px-6 py-3 border-b border-gray-200 text-sm font-medium
                ${notification.type === "success" ? "bg-green-50 text-green-700" : ""}
                ${notification.type === "error" ? "bg-red-50 text-red-700" : ""}
                ${notification.type === "info" ? "bg-blue-50 text-blue-700" : ""}
            `}
          >
            {notification.message}
          </div>
        )}

        {/* Table Area */}
        <div className="overflow-x-auto">
          {" "}
          {/* ... */}
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {tableColumns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider group whitespace-nowrap"
                      onClick={() => requestSort(column.key)}
                      style={{
                        cursor:
                          column.sortable !== false ? "pointer" : "default",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 group-hover:text-gray-900">
                          {column.label}
                        </span>
                        {sortConfig.key === column.key && (
                          <span className="ml-2 text-blue-500">
                            {sortConfig.direction === "asc" ? (
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
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-500 mb-3"
                          xmlns="http://www.w3.org/2000/svg"
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
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p>Loading data...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-red-600">
                        <XCircle size={32} className="mb-3 text-red-400" />
                        <p className="text-lg font-medium">
                          Error loading data
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{error}</p>
                        <button
                          onClick={fetchData}
                          className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((item) => (
                    <tr
                      key={item[itemKeyField]}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {tableColumns.map((column) => (
                        <td
                          key={`${item[itemKeyField]}-${column.key}`}
                          className="px-6 py-4 whitespace-nowrap text-sm"
                        >
                          {renderCell(item, column)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Search size={32} className="mb-3 text-gray-400" />
                        <p className="text-lg font-medium">
                          No matching records found
                        </p>
                        <button
                          onClick={handleClearAllFilters}
                          className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 0 /* ... */ && (
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-4">
              <div className="text-gray-700">
                Showing{" "}
                <span className="font-medium">{firstItemIndexOnPage}</span> to{" "}
                <span className="font-medium">{lastItemIndexOnPage}</span> of{" "}
                <span className="font-medium">{totalServerItems}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Rows:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-700"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className={`p-2 rounded-md border ${currentPage === 1 || isLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors shadow-sm`}
              >
                <ChevronLeft size={18} />
              </button>
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" ? setCurrentPage(page) : null
                  }
                  className={`w-9 h-9 rounded-md flex items-center justify-center font-medium ${page === currentPage ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"} border transition-colors ${typeof page !== "number" || isLoading ? "pointer-events-none opacity-60" : ""} shadow-sm`}
                  disabled={page === "..." || isLoading}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
                }
                disabled={
                  currentPage === totalPages || totalPages === 0 || isLoading
                }
                className={`p-2 rounded-md border ${currentPage === totalPages || totalPages === 0 || isLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors shadow-sm`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Item Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="View Item Details"
      >
        {selectedItem /* ... */ && (
          <div className="space-y-3">
            {initialColumns
              .filter((col) => col.key !== "actions")
              .map((col) => (
                <div key={col.key}>
                  <strong className="font-medium text-gray-700">
                    {col.label}:
                  </strong>
                  <span className="ml-2 text-gray-600">
                    {renderCell(selectedItem, col)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Item"
      >
        {selectedItem && formFields.length > 0 && (
          <EditItemForm
            item={selectedItem}
            formFields={formFields}
            onSubmit={handleSaveEdit}
            onCancel={() => setIsEditModalOpen(false)}
            itemKeyField={itemKeyField}
          />
        )}
      </Modal>

      {/* Create Item Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Item"
      >
        {formFields.length > 0 && (
          <EditItemForm
            item={null} // Pass null for item to signify create mode
            formFields={formFields}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            itemKeyField={itemKeyField} // May not be strictly needed for create but good for consistency
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        {selectedItem /* ... */ && (
          <div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <AlertTriangle size={16} className="mr-2" />
                )}
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
export default TableContentManager;
