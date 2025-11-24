import React from "react";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold">Trading Dashboard</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
