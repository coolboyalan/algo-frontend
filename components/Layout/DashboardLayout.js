"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  BarChart2,
  Settings,
  Banknote,
  Home,
  Notebook,
  DollarSign,
} from "lucide-react";

const DashboardLayout = ({ pageTitle, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [activePath, setActivePath] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State for displaying user info, initialized to server-rendered defaults
  const [displayName, setDisplayName] = useState("User Name");
  const [displayEmail, setDisplayEmail] = useState("user@example.com");

  const sidebarNavItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Asset", icon: DollarSign, path: "/assets" },
    { label: "Daily Asset", icon: Notebook, path: "/daily-asset" },
    { label: "Trades", icon: ArrowRightLeft, path: "/trades" },
    { label: "Broker Keys", icon: BarChart2, path: "/brokerKeys" },
    { label: "Brokers", icon: Banknote, path: "/brokers" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return; // Stop execution if not authenticated
    }
    setIsAuthenticated(true); // User is authenticated

    // Now that we are on the client and authenticated, update displayed info
    // This will cause a re-render only on the client after initial hydration
    const nameFromStorage = localStorage.getItem("name");
    const emailFromStorage = localStorage.getItem("email");

    if (nameFromStorage) {
      setDisplayName(nameFromStorage);
    }
    if (emailFromStorage) {
      setDisplayEmail(emailFromStorage);
    }

    // Set the initial active path based on the current window location
    setActivePath(window.location.pathname);

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // Empty dependency array: runs once on mount & client-side

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    setActivePath(path);
    window.location.href = path;
  };

  // This check helps prevent a flash of dashboard content if redirect is slow
  // or if the component renders before useEffect fully processes the auth state.
  if (
    !isAuthenticated &&
    typeof window !== "undefined" &&
    !localStorage.getItem("token")
  ) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div
        className={`bg-white text-gray-700 ${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200 shadow-sm`} // Corrected className placement
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 h-16">
          {sidebarOpen ? (
            <>
              <Image
                src="/logo.png"
                alt="Algoman Logo"
                width={45}
                height={45}
              />
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                Algoman
              </h1>
            </>
          ) : (
            <Image
              src="/logo.png"
              alt="Algoman Logo"
              width={45}
              height={45}
              className="mx-auto"
            />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>

        <nav className="mt-6 flex-1 px-3 space-y-1">
          {sidebarNavItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              className={`group flex items-center px-3 py-2.5 rounded-lg transition-colors ease-in-out duration-150
                ${sidebarOpen ? "" : "justify-center"}
                ${
                  activePath === item.path
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              title={sidebarOpen ? "" : item.label}
            >
              <item.icon
                className={`text-lg ${sidebarOpen ? "mr-3" : "mx-auto"} ${activePath === item.path ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"}`}
                aria-hidden="true"
              />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 mt-auto">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {displayName}
                </div>
                <div className="text-xs text-gray-500">{displayEmail}</div>
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white mx-auto"
              title={displayName}
            >
              <User size={20} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 h-16">
            <h2 className="text-xl font-semibold text-gray-900">
              {pageTitle || "Dashboard"}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity"
                  aria-label="User menu"
                >
                  <User size={18} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-20 border border-gray-200 animate-fadeIn">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-medium truncate">{displayEmail}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      <LogOut size={16} className="mr-2.5 text-gray-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        {/* Page content will be rendered here */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
