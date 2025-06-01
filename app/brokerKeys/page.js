// app/broker-keys/page.js (or your equivalent page route)
import TableContentManager from "@/components/CrudTable/TableContentManager"; // Adjust path

// Helper function (can be here or imported if used in many places)
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

async function getBrokersForFilterOptions() {
  // In a real app, fetch from your API
  // Ensure you use absolute URLs for server-side fetch or have NEXT_PUBLIC_API_BASE_URL correctly set
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Fallback for local dev
  try {
    // Example: Fetching all brokers to populate the filter dropdown
    // Adjust the endpoint and query params as needed (e.g., to get a simplified list for dropdowns)
    const response = await fetch(`${apiBaseUrl}/api/broker?limit=1000`); // Fetch a large number or implement pagination if list is huge
    if (!response.ok) {
      console.error(
        "Server: Failed to fetch brokers for filter:",
        response.status,
        await response.text(),
      );
      return [];
    }
    const result = await response.json();
    return result.data || []; // Assuming API returns { data: [{id: ..., name: ...}, ...] }
  } catch (error) {
    console.error("Server: Error fetching brokers for filter:", error);
    return []; // Return empty on error to prevent page crash
  }
}

export default async function BrokerKeyDashboardPage() {
  const brokersDataForFilter = await getBrokersForFilterOptions();

  const brokerKeyColumns = [
    { key: "id", label: "ID", type: "number", sortable: true },
    { key: "Broker.name", label: "Broker Name", type: "text", sortable: false }, // Adjust "Broker.name" based on your API response structure
    { key: "User.name", label: "User Name", type: "text", sortable: false }, // Adjust "User.name" based on your API response
    {
      key: "apiKey",
      label: "API Key",
      type: "text",
      sortable: false,
      // maxWidth: "150px",
      // render: (item) => {
      //   const k = String(getNestedValue(item, "apiKey") || "");
      //   return k.length > 7
      //     ? `${k.substring(0, 3)}...${k.substring(k.length - 4)}`
      //     : k;
      // },
    },
    {
      key: "apiSecret",
      label: "API Secret",
      type: "text",
      sortable: false,
      // render: () => "••••••••",
    },
    { key: "tokenDate", label: "Token Date", type: "date", sortable: true },
    {
      key: "status",
      label: "Status",
      type: "enum",
      enumConfig: [
        {
          value: true,
          display: "Active",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
        },
        {
          value: false,
          display: "Inactive",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
        },
      ],
      sortable: true,
    },
  ];

  const brokerKeyFilters = [
    {
      key: "status",
      label: "Status",
      type: "boolean",
      trueLabel: "Active",
      falseLabel: "Inactive",
    },
    {
      key: "brokerId",
      label: "Broker",
      type: "select",
      optionsSourceKey: "brokers", // This key will be used to find data in dynamicFilterOptionsData
      optionValueKey: "id", // Property for value in broker objects
      optionLabelKey: "name", // Property for label in broker objects
    },
    {
      key: "userId",
      label: "User ID",
      type: "number", // Will render as a number input for filtering
    },
  ];

  const brokerKeyFormFields = [
    {
      key: "userId",
      label: "User ID",
      type: "number",
      required: true,
      placeholder: "Enter User ID",
    },
    {
      key: "brokerId",
      label: "Broker ID",
      type: "number",
      required: true,
      placeholder: "Enter Broker ID",
    },
    {
      key: "apiKey",
      label: "API Key",
      type: "text",
      required: true,
      placeholder: "Enter API Key",
    },
    {
      key: "apiSecret",
      label: "API Secret",
      type: "password",
      required: true,
      placeholder: "Enter API Secret",
    },
    {
      key: "token",
      label: "Token",
      type: "text",
      placeholder: "Enter token (optional)",
    },
    { key: "tokenDate", label: "Token Date", type: "date" },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: true,
      defaultValue: true, // Values for select options should be strings if not handled by form
      options: [
        { value: "true", label: "Active" }, // Use strings for boolean options in simple select
        { value: "false", label: "Inactive" },
      ],
    },
  ];

  const dynamicOptionsForFilters = {
    brokers: brokersDataForFilter, // Pass the server-fetched brokers here
  };

  // If you wanted dynamic selects in the form, you'd fetch and pass data similarly:
  // const dynamicOptionsForForms = {
  //   allBrokers: brokersDataForFilter, // Could be the same or a different list
  //   allUsers: await getUsersForFormOptions(),
  // };

  return (
    <TableContentManager
      apiEndpoint="/api/broker-key"
      columns={brokerKeyColumns}
      filters={brokerKeyFilters}
      formFields={brokerKeyFormFields}
      itemKeyField="id"
      pageTitle="Broker Key Management"
      canAddItem={true}
      dynamicFilterOptionsData={dynamicOptionsForFilters}
      // dynamicSelectDataSources={dynamicOptionsForForms} // Pass if forms need dynamic data
    />
  );
}
