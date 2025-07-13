// components/CrudTable/TableContentManager.jsx
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

const getNestedValue = (obj, pathString) => {
  if (!obj || typeof pathString !== "string" || pathString.trim() === "")
    return undefined;
  const path = pathString.split(".");
  let current = obj;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (
      current === null ||
      typeof current !== "object" ||
      !Object.prototype.hasOwnProperty.call(current, key)
    ) {
      return undefined;
    }
    current = current[key];
  }
  return current;
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
  disableMobilePagination = false, // New prop to disable pagination on mobile
}) => {
  if (!mobileColumns.length) {
    mobileColumns = initialColumns.map((ele) => {
      return ele.key;
    });
  }

  const router = useRouter();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("id");
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [totalServerItems, setTotalServerItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [isMobile, setIsMobile] = useState(false); // Track mobile state

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const baseUrl =
    (typeof window !== "undefined" && window.NEXT_PUBLIC_API_BASE_URL) ||
    (typeof process !== "undefined" &&
      process.env &&
      process.env.NEXT_PUBLIC_API_BASE_URL) ||
    "";

  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const makeApiCall = async (endpointSuffix, method = "GET", body = null) => {
    const fullEndpoint = `${baseUrl}${endpointSuffix}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let requestBody = body;
    if (body && (method === "POST" || method === "PUT")) {
      requestBody = Object.entries(body).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});
    }

    try {
      const response = await fetch(fullEndpoint, {
        method,
        headers,
        ...(requestBody &&
          (method === "POST" || method === "PUT") && {
            body: JSON.stringify(requestBody),
          }),
      });
      const responseBody = await response.json().catch(() => response.text());
      if (!response.ok) {
        const errorMessage =
          typeof responseBody === "object" &&
          responseBody !== null &&
          responseBody.message
            ? responseBody.message
            : typeof responseBody === "string" && responseBody.trim() !== ""
              ? responseBody
              : `Operation failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      return responseBody;
    } catch (e) {
      console.error(`API call failed for ${method} ${fullEndpoint}:`, e);
      throw e;
    }
  };

  const handleCustomAction = async (item, action) => {
    if (!action.actionUrl) return;

    setIsLoading(true);
    try {
      const result = await makeApiCall(
        `${action.actionUrl}/${item[itemKeyField]}`,
        action.method || "PUT",
        action.payload || {},
      );
      setNotification({
        type: "success",
        message:
          result.message ||
          action.successMessage ||
          "Action completed successfully!",
      });
      fetchData();
    } catch (e) {
      setNotification({
        type: "error",
        message: e.message || action.errorMessage || "Failed to perform action",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
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
      if (value !== null && value !== undefined && String(value).trim() !== "")
        params.append(key, String(value));
    });
    const fullApiUrl = `${baseUrl}${apiEndpoint}?${params.toString()}`;
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(fullApiUrl, { headers });
      const result = await response.json().catch(async () => {
        throw new Error(await response.text());
      });
      if (!response.ok)
        throw new Error(
          result.message || `Failed to fetch data (status: ${response.status})`,
        );
      setData(result?.data?.result || []);
      setTotalServerItems(result?.data?.pagination?.totalItems || 0);
    } catch (e) {
      console.error("Fetch data error:", e);
      setError(e.message || "Failed to load data.");
      setData([]);
      setTotalServerItems(0);
      setNotification({
        type: "error",
        message: e.message || "Failed to load data.",
      });
    } finally {
      setIsLoading(false);
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
    itemKeyField,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCustomLink = async (item) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/broker/${item.brokerId}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data) {
        window.alert("Please add broker first");
        return;
      }

      router.push(`${item.loginUrl}`);
    } catch (error) {
      window.alert("Unable to login, Internal Error");
    }
  };

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
    setSelectedItem(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (newItemData) => {
    setIsLoading(true);
    try {
      const result = await makeApiCall(apiEndpoint, "POST", newItemData);
      setNotification({
        type: "success",
        message: result.message || "Item created successfully!",
      });
      setIsCreateModalOpen(false);
      fetchData();
    } catch (e) {
      setNotification({
        type: "error",
        message: e.message || "Failed to create item.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSaveEdit = async (editedItem) => {
    if (!selectedItem || selectedItem[itemKeyField] === undefined) {
      setNotification({
        type: "error",
        message: "No item selected or item has no ID.",
      });
      return;
    }
    const itemId = selectedItem[itemKeyField];
    setIsLoading(true);
    try {
      const result = await makeApiCall(
        `${apiEndpoint}/${itemId}`,
        "PUT",
        editedItem,
      );
      setNotification({
        type: "success",
        message: result.message || "Item updated successfully!",
      });
      setIsEditModalOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (e) {
      setNotification({
        type: "error",
        message: e.message || "Failed to update item.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleConfirmDelete = async () => {
    if (!selectedItem || selectedItem[itemKeyField] === undefined) {
      setNotification({
        type: "error",
        message: "No item selected or item has no ID.",
      });
      return;
    }
    const itemId = selectedItem[itemKeyField];
    setIsLoading(true);
    try {
      const result = await makeApiCall(`${apiEndpoint}/${itemId}`, "DELETE");
      setNotification({
        type: "success",
        message: result.message || "Item deleted successfully!",
      });
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (e) {
      setNotification({
        type: "error",
        message: e.message || "Failed to delete item.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhance columns with mobile visibility information
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
      showOnMobile: true, // Always show actions on mobile
    },
  ];

  const requestSort = (key) => {
    const columnConfig = tableColumns.find((col) => col.key === key);
    if (!columnConfig || columnConfig.sortable === false) return;
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value === "all" || value === "" ? null : value,
    }));
    setCurrentPage(1);
  };
  const clearDateRange = () => {
    setDateRange({ start: null, end: null });
    setCurrentPage(1);
  };
  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };
  const handleSearchColumnChange = (newSearchColumn) => {
    setSearchColumn(newSearchColumn);
    setCurrentPage(1);
  };
  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
    setCurrentPage(1);
  };
  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSearchColumn("all");
    setActiveFilters({});
    setDateRange({ start: null, end: null });
    setSortConfig({ key: null, direction: "asc" });
    setCurrentPage(1);
  };

  const totalPages =
    totalServerItems > 0 ? Math.ceil(totalServerItems / itemsPerPage) : 0;
  const firstItemIndexOnPage =
    data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const lastItemIndexOnPage = (currentPage - 1) * itemsPerPage + data.length;

  const renderCell = (item, column) => {
    if (column.render && typeof column.render === "function") {
      return column.render(item, column);
    }
    if (column.type === "actions") {
      return (
        <div className="flex items-center space-x-1.5">
          {customLink && (
            <button
              onClick={() => handleCustomLink(item)}
              className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-100 transition-colors"
              title="View"
            >
              <Link2 size={16} />
            </button>
          )}
          <button
            onClick={() => handleViewItem(item)}
            className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-100 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditItem(item)}
            className="text-green-600 hover:text-green-800 p-1.5 rounded hover:bg-green-100 transition-colors"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => handleDeleteItem(item)}
            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>

          {/* Custom Actions */}
          {customActions.map((action, index) => {
            return (
              <button
                key={index}
                onClick={() => handleCustomAction(item, action)}
                className={`${action.color || "text-gray-600 hover:text-gray-800"} ${action.bgColor || "hover:bg-gray-100"} p-1.5 rounded transition-colors`}
                title={action.title}
              >
                {action.icon || <Cross size={16} />}
              </button>
            );
          })}
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
          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${enumConfig?.bgColor || "bg-gray-100"} ${enumConfig?.textColor || "text-gray-800"}`}
        >
          {enumConfig?.display ||
            (value !== null && value !== undefined ? String(value) : "")}
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
          {String(value)}
        </span>
      );
    }
    if (column.type === "date" && value) {
      try {
        return (
          <div className="text-sm text-gray-700 whitespace-nowrap">
            {new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        );
      } catch (e) {
        return <div className="text-sm text-red-500">Invalid Date</div>;
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
        <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
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
        className="text-sm text-gray-700 whitespace-nowrap truncate"
        title={displayValue}
        style={{ maxWidth: "auto" }}
      >
        {displayValue}
      </div>
    );
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (!totalPages || totalPages <= 0) return [];
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
    <DashboardLayout>
      <div className="bg-white shadow-md rounded-lg w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-grow max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <select
                  value={searchColumn}
                  onChange={(e) => handleSearchColumnChange(e.target.value)}
                  className="h-full bg-transparent border-none text-sm text-gray-500 focus:ring-0 pr-7 appearance-none"
                >
                  {initialColumns
                    .filter(
                      (c) => c.searchable !== false && c.type !== "actions",
                    )
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
                className="text-gray-600 pl-10 pr-28 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-3 flex-wrap">
              {canAddItem && (
                <button
                  onClick={handleOpenCreateModal}
                  className="flex items-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 border-blue-500"
                >
                  <PlusCircle size={16} className="mr-2" /> Add New
                </button>
              )}
              {filters && filters.length > 0 && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${showFilters ? "bg-blue-50 text-blue-600 border-blue-300" : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"}`}
                >
                  <Filter size={16} className="mr-2" /> Filters
                </button>
              )}
              <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 transition-colors">
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

          {showFilters && filters && filters.length > 0 && (
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
                    <label
                      htmlFor={`filter-${filter.key}`}
                      className="block text-xs font-medium text-gray-600 mb-1.5"
                    >
                      {filter.label}
                    </label>
                    {filter.type === "boolean" ? (
                      <select
                        id={`filter-${filter.key}`}
                        className="text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={
                          activeFilters[filter.key] === undefined ||
                          activeFilters[filter.key] === null
                            ? "all"
                            : String(activeFilters[filter.key])
                        }
                        onChange={(e) => {
                          let val;
                          if (e.target.value === "true") val = true;
                          else if (e.target.value === "false") val = false;
                          else val = null;
                          handleFilterChange(filter.key, val);
                        }}
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
                        id={`filter-${filter.key}`}
                        className="text-black w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={activeFilters[filter.key] || "all"}
                        onChange={(e) =>
                          handleFilterChange(
                            filter.key,
                            e.target.value === "all" ? null : e.target.value,
                          )
                        }
                      >
                        <option value="all">All {filter.label}</option>
                        {filter.optionsSourceKey &&
                        dynamicFilterOptionsData &&
                        dynamicFilterOptionsData[filter.optionsSourceKey]
                          ? (
                              dynamicFilterOptionsData[
                                filter.optionsSourceKey
                              ] || []
                            ).map((option) => (
                              <option
                                key={option[filter.optionValueKey || "id"]}
                                value={option[filter.optionValueKey || "id"]}
                              >
                                {option[filter.optionLabelKey || "name"]}
                              </option>
                            ))
                          : (filter.options || []).map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                      </select>
                    ) : (
                      <input
                        id={`filter-${filter.key}`}
                        type={
                          filter.type === "number"
                            ? "number"
                            : filter.type === "date"
                              ? "date"
                              : "text"
                        }
                        placeholder={`${filter.label}...`}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={activeFilters[filter.key] || ""}
                        onChange={(e) =>
                          handleFilterChange(filter.key, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {notification.message && (
          <div
            className={`px-6 py-3 border-b text-sm font-medium transition-opacity duration-300 ease-in-out ${notification.type === "success" ? "bg-green-50 text-green-700 border-green-200" : ""} ${notification.type === "error" ? "bg-red-50 text-red-700 border-red-200" : ""} ${notification.type === "info" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}`}
          >
            {notification.message}
            <button
              onClick={() => setNotification({ type: "", message: "" })}
              className="float-right font-bold text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {tableColumns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider group whitespace-nowrap ${
                        column.showOnMobile ? "" : "hidden sm:table-cell"
                      }`}
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
                {isLoading && data.length === 0 ? (
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
                ) : error && data.length === 0 ? (
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
                ) : !isLoading && data.length === 0 ? (
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
                ) : (
                  data.map((item) => (
                    <tr
                      key={item[itemKeyField]}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
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
        </div>

        {totalPages > 0 && (
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

            {/* Conditionally render pagination controls */}
            {!disableMobilePagination || !isMobile ? (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages || 1),
                    )
                  }
                  disabled={
                    currentPage === totalPages || totalPages === 0 || isLoading
                  }
                  className={`p-2 rounded-md border ${currentPage === totalPages || totalPages === 0 || isLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors shadow-sm`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : null}
          </div>
        )}

        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`View ${pageTitle.replace("Management", "").trim()} Details`}
        >
          {selectedItem && (
            <div className="space-y-3 text-sm">
              {initialColumns
                .filter(
                  (col) => col.type !== "actions" && col.key !== "actions",
                )
                .map((col) => (
                  <div
                    key={col.key}
                    className="flex border-b py-2.5 last:border-b-0"
                  >
                    <strong className="w-2/5 font-semibold text-gray-700">
                      {col.label}:
                    </strong>
                    <div className="w-3/5 text-gray-600 flex items-center">
                      {renderCell(selectedItem, col)}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Modal>
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit ${pageTitle.replace("Management", "").trim()}`}
        >
          {selectedItem && formFields.length > 0 && (
            <EditItemForm
              item={selectedItem}
              formFields={formFields}
              onSubmit={handleSaveEdit}
              onCancel={() => setIsEditModalOpen(false)}
              itemKeyField={itemKeyField}
              dynamicSelectOptions={dynamicSelectDataSources}
            />
          )}
        </Modal>
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={`Create New ${pageTitle.replace("Management", "").trim()}`}
        >
          {formFields.length > 0 && (
            <EditItemForm
              item={null}
              formFields={formFields}
              onSubmit={handleCreateSubmit}
              onCancel={() => setIsCreateModalOpen(false)}
              itemKeyField={itemKeyField}
              dynamicSelectOptions={dynamicSelectDataSources}
            />
          )}
        </Modal>
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Deletion"
          size="sm"
        >
          {selectedItem && (
            <div>
              <div className="flex items-center mb-4">
                <AlertTriangle
                  size={24}
                  className="text-red-500 mr-3 flex-shrink-0"
                />
                <p className="text-gray-700 text-md">
                  Are you sure you want to delete this item? <br />
                  This action cannot be undone.
                </p>
              </div>
              <div className="text-sm bg-gray-50 p-3 rounded-md mb-6">
                <strong>Item ID:</strong> {selectedItem[itemKeyField]}
                {initialColumns.find(
                  (col) => col.key === "name" && selectedItem.name,
                )
                  ? ` - ${selectedItem.name}`
                  : initialColumns.find(
                        (col) =>
                          getNestedValue(selectedItem, col.key) &&
                          col.key.includes("name"),
                      )
                    ? ` - ${getNestedValue(selectedItem, initialColumns.find((col) => col.key.includes("name")).key)}`
                    : ""}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-red-400"
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
                    <Trash2 size={16} className="mr-2" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default TableContentManager;
