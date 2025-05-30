import TableComponent from "@/components/TableComponent";

const TradesPage = () => {
  const resolvedApiEndpoint = `/api/user`;

  console.log(resolvedApiEndpoint);

  // Column definitions (these are part of your UI configuration)
  const columns = [
    { key: "id", label: "ID", type: "text" },
    { key: "symbol", label: "Symbol", type: "text" },
    {
      key: "direction",
      label: "Direction",
      type: "direction",
      // enumConfig is used by renderCell, not directly for API query construction here
      enumConfig: [
        {
          value: "long",
          display: "Long",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        },
        {
          value: "short",
          display: "Short",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
        },
      ],
    },
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "price", label: "Price", type: "currency" },
    { key: "broker", label: "Broker", type: "text" },
    { key: "date", label: "Date", type: "date" },
    {
      key: "status",
      label: "Status",
      type: "enum",
      enumConfig: [
        {
          value: "filled",
          display: "Filled",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
        },
        {
          value: "pending",
          display: "Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
        },
        {
          value: "cancelled",
          display: "Cancelled",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        },
      ],
    },
  ];

  // Filter options (these are part of your UI configuration)
  const filters = [
    {
      key: "broker", // This key will be used in API query: &broker=IBKR
      label: "Broker",
      options: [
        { value: "IBKR", label: "Interactive Brokers" },
        { value: "TD Ameritrade", label: "TD Ameritrade" },
        { value: "Fidelity", label: "Fidelity" },
        // Add more brokers based on what your API supports or what you expect
        { value: "Zerodha", label: "Zerodha" },
        { value: "Upstox", label: "Upstox" },
        { value: "ICICI Direct", label: "ICICI Direct" },
        { value: "Angel One", label: "Angel One" },
      ],
    },
    {
      key: "direction", // &direction=long
      label: "Direction",
      options: [
        { value: "long", label: "Long" },
        { value: "short", label: "Short" },
      ],
    },
    {
      key: "status", // &status=filled
      label: "Status",
      options: [
        { value: "filled", label: "Filled" },
        { value: "pending", label: "Pending" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
  ];

  return (
    <TableComponent
      apiEndpoint={resolvedApiEndpoint} // Example: ensure this matches your actual API route
      columns={columns}
      filters={filters}
      title="Trades Dashboard"
    />
  );
};

export default TradesPage;
