"use client";

import { useState, useEffect, useRef, useCallback } from "react";
// Removed: import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  CalendarDays, // Changed from FiCalendar
  User,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  BarChart2,
  XCircle,
  ArrowRightLeft, // Changed from FaExchangeAlt
  ArrowUp, // Changed from FaLongArrowAltUp
  ArrowDown, // Changed from FaLongArrowAltDown
} from "lucide-react"; // Using lucide-react for icons

const TableComponent = ({
  apiEndpoint = "/api/trade", // Default API endpoint
  columns = [],
  filters = [],
  title = "Data Table", // Default title
}) => {
  // Removed: const router = useRouter();
  const [data, setData] = useState([]); // Holds data for the current page from API
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [totalServerItems, setTotalServerItems] = useState(0); // Total items on server matching criteria
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // API data fetching logic
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
      if (searchColumn !== "all") {
        params.append("searchIn", searchColumn);
      }
    }

    if (dateRange.start) {
      params.append("startDate", dateRange.start);
    }
    if (dateRange.end) {
      params.append("endDate", dateRange.end);
    }

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        params.append(key, String(value));
      }
    });

    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      const response = await fetch(
        `${baseUrl}${apiEndpoint}?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // Add token if exists
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData || "Failed to fetch"}`,
        );
      }

      const result = await response.json();
      setData(result?.data?.result|| []);
      setTotalServerItems(result?.data?.total || 0);
    } catch (e) {
      setError(e.message || "An unknown error occurred");
      setData([]);
      setTotalServerItems(0);
      console.error("Failed to fetch data:", e);
    } finally {
      setIsLoading(false);
    }
  }, [
    apiEndpoint,
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

  // Handle sort request
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? null : value,
    }));
    setCurrentPage(1);
  };

  // Handle logout
  const handleLogout = () => {
    // Implement actual logout logic (e.g., clearing tokens, redirecting)
    // router.push("/login"); // Example redirect
    window.location.href = "/login"; // Using window.location for basic navigation
  };

  // Clear date range
  const clearDateRange = () => {
    setDateRange({ start: null, end: null });
    setCurrentPage(1);
  };

  // Update search term and reset page
  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  // Update search column and reset page
  const handleSearchColumnChange = (newSearchColumn) => {
    setSearchColumn(newSearchColumn);
    setCurrentPage(1);
  };

  // Update date range and reset page
  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(totalServerItems / itemsPerPage);
  const itemsOnCurrentPage = data.length;
  const firstItemIndexOnPage =
    itemsOnCurrentPage > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const lastItemIndexOnPage =
    (currentPage - 1) * itemsPerPage + itemsOnCurrentPage;

  // Render cell based on column type
  const renderCell = (item, column) => {
    const value = item[column.key];

    if (column.type === "enum") {
      const enumConfig = column.enumConfig?.find((e) => e.value === value);
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${enumConfig?.bgColor || "bg-gray-100"} ${enumConfig?.textColor || "text-gray-800"}`}
        >
          {enumConfig?.display || value}
        </span>
      );
    }

    if (column.type === "direction") {
      return (
        <span
          className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            value === "long"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value === "long" ? (
            <ArrowUp className="mr-1" /> // Changed icon
          ) : (
            <ArrowDown className="mr-1" /> // Changed icon
          )}
          {value}
        </span>
      );
    }

    if (column.type === "date") {
      return (
        <div className="text-sm text-gray-700">
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
        <div className="font-medium text-gray-900">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD", // Consider making this configurable
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value)}
        </div>
      );
    }

    return <div className="text-sm text-gray-700">{String(value)}</div>;
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let leftBound = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      );
      let rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);

      // Adjust bounds if they are too close to the edges
      if (rightBound - leftBound + 1 < maxVisiblePages) {
        if (leftBound === 1) {
          rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);
        } else if (rightBound === totalPages) {
          leftBound = Math.max(1, rightBound - maxVisiblePages + 1);
        }
      }

      if (leftBound > 1) {
        pages.push(1);
        if (leftBound > 2) {
          pages.push("...");
        }
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSearchColumn("all");
    setActiveFilters({});
    setDateRange({ start: null, end: null });
    setSortConfig({ key: null, direction: "asc" });
    setCurrentPage(1); // This will trigger a fetch
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Modern White Sidebar */}
      <div
        className={`bg-white text-gray-700 ${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 flex flex-col border-r border-gray-200`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold mr-2">
                A
              </div>
              Algoman
            </h1>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="text-gray-500" /> // Changed icon
            ) : (
              <ChevronRight className="text-gray-500" /> // Changed icon
            )}
          </button>
        </div>

        <nav className="mt-6 flex-1 px-3">
          <div
            className={`px-4 py-3 rounded-lg flex items-center cursor-pointer transition-colors ${sidebarOpen ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
          >
            {sidebarOpen ? (
              <span className="font-medium flex items-center">
                <ArrowRightLeft className="mr-3 text-lg" /> {/* Changed icon */}
                Trades
              </span>
            ) : (
              <ArrowRightLeft className="mx-auto text-lg" /> // Changed icon
            )}
          </div>

          <div
            className={`mt-1 px-4 py-3 rounded-lg flex items-center cursor-pointer transition-colors hover:bg-gray-100 ${sidebarOpen ? "" : "justify-center"}`}
          >
            {sidebarOpen ? (
              <span className="font-medium flex items-center text-gray-600">
                <BarChart2 className="mr-3 text-lg" /> {/* Changed icon */}
                Analytics
              </span>
            ) : (
              <BarChart2 className="mx-auto text-lg" /> // Changed icon
            )}
          </div>

          <div
            className={`mt-1 px-4 py-3 rounded-lg flex items-center cursor-pointer transition-colors hover:bg-gray-100 ${sidebarOpen ? "" : "justify-center"}`}
          >
            {sidebarOpen ? (
              <span className="font-medium flex items-center text-gray-600">
                <Settings className="mr-3 text-lg" /> {/* Changed icon */}
                Settings
              </span>
            ) : (
              <Settings className="mx-auto text-lg" /> // Changed icon
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                <User /> {/* Changed icon */}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900">User Name</div>
                <div className="text-xs text-gray-500">user@algoman.com</div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold mx-auto">
              <User /> {/* Changed icon */}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Clean Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>

            <div className="flex items-center space-x-4">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-medium shadow-sm"
                >
                  <User /> {/* Changed icon */}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-200">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium">user@algoman.com</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="mr-3" /> {/* Changed icon */}
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Modern Toolbar */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" /> {/* Changed icon */}
              </div>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <select
                  value={searchColumn}
                  onChange={(e) => handleSearchColumnChange(e.target.value)}
                  className="h-full bg-transparent border-none text-sm text-gray-500 focus:ring-0 pr-7"
                >
                  <option value="all">All Columns</option>
                  {columns.map((column) => (
                    <option key={column.key} value={column.key}>
                      {column.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-24 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2.5 rounded-lg border transition-all ${
                    showFilters
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  } shadow-sm`}
                >
                  <Filter className="mr-2" /> {/* Changed icon */}
                  Filters
                </button>
              </div>

              <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 px-3 py-2 hover:border-gray-400 transition-colors shadow-sm">
                <CalendarDays className="text-gray-500" /> {/* Changed icon */}
                <input
                  type="date"
                  className="bg-transparent border-none focus:ring-0 text-sm text-gray-700 w-28"
                  value={dateRange.start || ""}
                  onChange={(e) =>
                    handleDateChange({ ...dateRange, start: e.target.value })
                  }
                />
                <span className="text-gray-400">to</span>
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
                    className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} /> {/* Changed icon */}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wider">
                  Filter by:
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} /> {/* Changed icon */}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filters.map((filter) => (
                  <div key={filter.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {filter.label}
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
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

        {/* Minimal Table */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                {" "}
                {/* Sticky header */}
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                      onClick={() => requestSort(column.key)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                          {column.label}
                        </span>
                        {sortConfig.key === column.key && (
                          <span className="ml-2 text-blue-500">
                            {sortConfig.direction === "asc" ? (
                              <ChevronUp size={16} /> // Changed icon
                            ) : (
                              <ChevronDown size={16} /> // Changed icon
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
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
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
                        <p className="text-gray-600 text-lg font-medium">
                          Loading data...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-red-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <XCircle className="text-red-400 mb-3" size={28} />{" "}
                        {/* Changed icon */}
                        <p className="text-red-600 text-lg font-medium">
                          Error loading data
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{error}</p>
                        <button
                          onClick={fetchData} // Retry button
                          className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((item, index) => (
                    <tr
                      key={item.id || index} // Prefer a unique ID from item if available
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {columns.map((column) => (
                        <td
                          key={`${item.id || index}-${column.key}`}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {renderCell(item, column)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Search className="text-gray-400 mb-3" size={28} />{" "}
                        {/* Changed icon */}
                        <p className="text-gray-600 text-lg font-medium">
                          No matching records found
                        </p>
                        <button
                          onClick={handleClearAllFilters}
                          className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
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

        {/* Modern Pagination */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{firstItemIndexOnPage}</span> to{" "}
              <span className="font-medium">{lastItemIndexOnPage}</span> of{" "}
              <span className="font-medium">{totalServerItems}</span> results
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-400 focus:border-blue-400 shadow-sm text-gray-700"
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
              className={`p-2 rounded-lg border ${
                currentPage === 1 || isLoading
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              } transition-colors shadow-sm`}
            >
              <ChevronLeft size={18} /> {/* Changed icon */}
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" ? setCurrentPage(page) : null
                }
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                  page === currentPage
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                } border transition-colors ${
                  typeof page !== "number" || isLoading
                    ? "pointer-events-none opacity-50"
                    : ""
                } shadow-sm`}
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
              className={`p-2 rounded-lg border ${
                currentPage === totalPages || totalPages === 0 || isLoading
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              } transition-colors shadow-sm`}
            >
              <ChevronRight size={18} /> {/* Changed icon */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
