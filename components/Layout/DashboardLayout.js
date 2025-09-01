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
  IndianRupee,
} from "lucide-react";

// Dark theme configuration
const darkTheme = {
  background: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
  sidebar: "bg-slate-900/95 backdrop-blur-sm border-slate-700/50",
  sidebarHover: "hover:bg-slate-700/50",
  sidebarActive:
    "bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-sky-400 border-r-2 border-sky-400",
  header: "bg-slate-800/90 backdrop-blur-sm border-slate-700/50",
  card: "bg-slate-800/60 border-slate-700/50",
  text: "text-slate-100",
  textMuted: "text-slate-400",
  textSecondary: "text-slate-300",
  button:
    "bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700",
  buttonSecondary: "bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/50",
};

const DashboardLayout = ({ pageTitle, children }) => {
  // Consolidated state
  const [state, setState] = useState({
    mobileMenuOpen: false,
    profileOpen: false,
    activePath: "",
    isAuthenticated: false,
    displayName: "User Name",
    displayEmail: "user@example.com",
    sidebarNavItems: [],
  });

  const profileRef = useRef(null);

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Navigation items based on role
    const navItems = {
      admin: [
        { label: "Dashboard", icon: Home, path: "/dashboard" },
        { label: "Asset", icon: IndianRupee, path: "/assets" },
        { label: "Daily Asset", icon: Notebook, path: "/daily-asset" },
        { label: "Trades", icon: ArrowRightLeft, path: "/trades" },
        { label: "Broker Keys", icon: BarChart2, path: "/brokerKeys/admin" },
        { label: "Brokers", icon: Banknote, path: "/brokers" },
        { label: "Users", icon: User, path: "/users" },
      ],
      user: [
        { label: "Dashboard", icon: Home, path: "/dashboard" },
        { label: "Trades", icon: ArrowRightLeft, path: "/trades" },
        { label: "Broker Keys", icon: BarChart2, path: "/brokerKeys" },
      ],
    };

    updateState({
      isAuthenticated: true,
      sidebarNavItems: navItems[role] || navItems.user,
      displayName: localStorage.getItem("name") || "User Name",
      displayEmail: localStorage.getItem("email") || "user@example.com",
      activePath: window.location.pathname,
    });

    // Click outside handler for profile dropdown
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        updateState({ profileOpen: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    ["token", "name", "email", "role"].forEach((item) =>
      localStorage.removeItem(item),
    );
    window.location.href = "/login";
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    updateState({ activePath: path, mobileMenuOpen: false });
    window.location.href = path;
  };

  if (
    !state.isAuthenticated &&
    typeof window !== "undefined" &&
    !localStorage.getItem("token")
  ) {
    return null;
  }

  return (
    <div
      className={`flex h-screen ${darkTheme.background} font-sans ${darkTheme.text}`}
    >
      {/* Mobile Overlay */}
      {state.mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => updateState({ mobileMenuOpen: false })}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 ${darkTheme.sidebar}
        transform ${state.mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${state.mobileMenuOpen ? "w-full sm:w-80" : "w-64"}
        transition-all duration-300 ease-in-out flex flex-col border-r shadow-2xl`}
      >
        {/* Logo Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700/50 h-16">
          <a className="flex items-center group" href="/dashboard">
            <div
              className={`${darkTheme.button} p-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform`}
            >
              <Image
                src="/logo.png"
                alt="Algoman Logo"
                width={36}
                height={36}
              />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent ml-3">
              Algoman
            </h1>
          </a>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => updateState({ mobileMenuOpen: false })}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 px-3 space-y-2">
          {state.sidebarNavItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                state.activePath === item.path
                  ? darkTheme.sidebarActive
                  : `${darkTheme.textMuted} ${darkTheme.sidebarHover} hover:text-slate-200`
              }`}
            >
              <div className="mr-3">
                <item.icon
                  className={`text-lg transition-colors ${
                    state.activePath === item.path
                      ? "text-sky-400"
                      : "text-slate-400 group-hover:text-slate-300"
                  }`}
                />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* User Info Footer */}
        <div className="p-4 border-t border-slate-700/50 mt-auto">
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-xl ${darkTheme.button} flex items-center justify-center text-white shadow-lg`}
            >
              <User size={22} />
            </div>
            <div className="ml-3 overflow-hidden flex-1">
              <div className="text-sm font-semibold text-slate-200 truncate">
                {state.displayName}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {state.displayEmail}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`${darkTheme.header} border-b shadow-lg`}>
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center">
              <button
                className={`lg:hidden mr-4 p-2.5 rounded-xl ${darkTheme.button} text-white shadow-lg hover:shadow-xl transition-all`}
                onClick={() => updateState({ mobileMenuOpen: true })}
              >
                <Menu size={20} />
              </button>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent truncate max-w-[60vw]">
                {pageTitle || "Dashboard"}
              </h2>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => updateState({ profileOpen: !state.profileOpen })}
                className={`w-10 h-10 rounded-xl ${darkTheme.button} flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
              >
                <User size={18} />
              </button>

              {state.profileOpen && (
                <div
                  className={`absolute right-0 mt-3 w-64 ${darkTheme.card} backdrop-blur-sm rounded-xl shadow-2xl py-2 z-20 border animate-in slide-in-from-top-2 duration-200`}
                >
                  <div className="px-4 py-3 border-b border-slate-700/50">
                    <p className="text-sm font-medium text-slate-200">
                      {state.displayName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {state.displayEmail}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 transition-colors rounded-lg mx-1 mt-1"
                  >
                    <LogOut size={16} className="mr-3 text-slate-400" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto ${darkTheme.background} p-4 sm:p-6`}
        >
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
