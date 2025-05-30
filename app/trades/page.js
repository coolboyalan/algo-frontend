// app/trades/page.js (or app/dashboard/trades/page.js etc.)
"use client";
import TableContentManager from "@/components/CrudTable/TableContentManager"; // Adjust path

const TradeDashboardPage = () => {
  const tradeColumns = [
    { key: "timestamp", label: "Timestamp", type: "date", sortable: true },
    { key: "symbol", label: "Symbol", sortable: true },
    {
      key: "type",
      label: "Type",
      type: "enum",
      enumConfig: [
        {
          value: "buy",
          display: "Buy",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
        },
        {
          value: "sell",
          display: "Sell",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
        },
      ],
      sortable: true,
    },
    { key: "quantity", label: "Quantity", type: "number", sortable: true },
    {
      key: "price",
      label: "Price",
      type: "currency",
      currency: "USD",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      type: "enum",
      enumConfig: [
        {
          value: "filled",
          display: "Filled",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
        },
        {
          value: "pending",
          display: "Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
        },
      ],
      sortable: true,
    },
  ];

  // Example filters configuration
  const tradeFilters = [
    {
      key: "type",
      label: "Trade Type",
      options: [
        { value: "buy", label: "Buy" },
        { value: "sell", label: "Sell" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "filled", label: "Filled" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  // Example form fields for editing/creating a trade
  const tradeFormFields = [
    {
      key: "symbol",
      label: "Symbol",
      type: "text",
      required: true,
      placeholder: "e.g., AAPL",
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select type" },
        { value: "buy", label: "Buy" },
        { value: "sell", label: "Sell" },
      ],
    },
    {
      key: "quantity",
      label: "Quantity",
      type: "number",
      required: true,
      placeholder: "e.g., 100",
    },
    {
      key: "price",
      label: "Price",
      type: "number",
      required: true,
      placeholder: "e.g., 150.25",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select status" },
        { value: "pending", label: "Pending" },
        { value: "filled", label: "Filled" },
      ],
    },
    {
      key: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Optional notes about the trade",
    },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/user"
      columns={tradeColumns}
      filters={tradeFilters}
      itemKeyField="id"
      formFields={tradeFormFields}
      pageTitle="Trade Management"
    />
  );
};
export default TradeDashboardPage;
