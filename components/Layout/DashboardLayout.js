"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  User,
  LogOut,
  ArrowRightLeft,
  BarChart2,
  Banknote,
  Home,
  Notebook,
  Menu,
  X,
} from "lucide-react";

const DashboardLayout = ({ pageTitle, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [activePath, setActivePath] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State for displaying user info
  const [displayName, setDisplayName] = useState("User Name");
  const [displayEmail, setDisplayEmail] = useState("user@example.com");
  const [sidebarNavItems, setSidebarNavItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      window.location.href = "/login";
      return;
    }
    setIsAuthenticated(true);

    if (role === "admin") {
      setSidebarNavItems([
        { label: "Dashboard", icon: Home, path: "/dashboard" },
        {
          label: "Asset",
          icon: () => (
            <span className="font-bold text-2xl text-gray-400 mr-1">₹</span>
          ),
          path: "/assets",
        },
        { label: "Daily Asset", icon: Notebook, path: "/daily-asset" },
        { label: "Trades", icon: ArrowRightLeft, path: "/trades" },
        { label: "Broker Keys", icon: BarChart2, path: "/brokerKeys/admin" },
        { label: "Brokers", icon: Banknote, path: "/brokers" },
        { label: "Users", icon: User, path: "/users" },
      ]);
    } else if (role === "user") {
      setSidebarNavItems([
        { label: "Dashboard", icon: Home, path: "/dashboard" },
        { label: "Trades", icon: ArrowRightLeft, path: "/trades" },
        { label: "Broker Keys", icon: BarChart2, path: "/brokerKeys" },
      ]);
    }

    const nameFromStorage = localStorage.getItem("name");
    const emailFromStorage = localStorage.getItem("email");

    if (nameFromStorage) setDisplayName(nameFromStorage);
    if (emailFromStorage) setDisplayEmail(emailFromStorage);

    setActivePath(window.location.pathname);

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    setActivePath(path);
    setMobileMenuOpen(false);
    window.location.href = path;
  };

  if (
    !isAuthenticated &&
    typeof window !== "undefined" &&
    !localStorage.getItem("token")
  ) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Mobile Sidebar Overlay - Fixed black background issue */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Fixed z-index to appear above overlay */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-white text-gray-700
          transform ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0
          w-64
          transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200 shadow-lg`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 h-16">
          <div className="flex items-center">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Image
                src="/logo.png"
                alt="Algoman Logo"
                width={36}
                height={36}
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900 ml-3">Algoman</h1>
          </div>

          {/* Close button for mobile sidebar - Improved positioning */}
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 flex-1 px-3 space-y-1">
          {sidebarNavItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              className={`group flex items-center px-3 py-3 rounded-lg transition-colors ease-in-out duration-150
                ${
                  activePath === item.path
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <div className="mr-3">
                <item.icon
                  className={`text-lg ${
                    activePath === item.path
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                  aria-hidden="true"
                />
              </div>
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div className="ml-3 overflow-hidden">
              <div className="text-sm font-medium text-gray-900 truncate">
                {displayName}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {displayEmail}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center">
              {/* Mobile Menu Button in Header */}
              <button
                className="lg:hidden mr-4 p-2 rounded-md bg-indigo-600 text-white"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 truncate max-w-[60vw]">
                {pageTitle || "Dashboard"}
              </h2>
            </div>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-sm hover:opacity-90"
              >
                <User size={18} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-20 border border-gray-200">
                  <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium truncate">{displayEmail}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2.5 text-gray-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
