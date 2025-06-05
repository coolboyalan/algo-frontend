// app/broker-keys/page.js (Server Component)
import TableContentManager from "@/components/CrudTable/TableContentManager";

async function getAllBrokers() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${apiBaseUrl}/api/broker?pagination=false`); // Fetch all brokers
    if (!response.ok) {
      console.error(
        "Server: Failed to fetch brokers:",
        response.status,
        await response.text(),
      );
      return [];
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Server: Error fetching brokers:", error);
    return [];
  }
}

export default async function BrokerKeyDashboardPage() {
  const allBrokersData = await getAllBrokers();

  const brokerKeyColumns = [
    {
      key: "id",
      label: "ID",
      type: "number",
      sortable: true,
      searchable: false,
    },
    // Ensure API response for /api/broker-key includes e.g. item.Broker = { name: "..." }
    // Adjust "Broker.name" or "User.name" to match the exact path in your API response objects
    {
      key: "Broker.name",
      label: "Broker Name",
      type: "text",
      sortable: true,
    },
    {
      key: "User.name",
      label: "User Name",
      type: "text",
      sortable: true,
    },
    {
      key: "redirectUrl",
      label: "Redirection Url",
      type: "text",
    },
    {
      key: "apiKey",
      label: "API Key",
      type: "text",
      sortable: false,
      maxWidth: "150px",
      searchable: false,
    }, // No custom render
    {
      key: "apiSecret",
      label: "API Secret",
      type: "text",
      sortable: false,
      maxWidth: "100px",
      searchable: false,
    }, // No custom render (shows actual secret)
    // { key: "tokenDate", label: "Token Date", type: "date", sortable: true },
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
      searchable: false,
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
      optionsSourceKey: "brokersForFilter",
      optionValueKey: "id",
      optionLabelKey: "name",
    },
  ];

  const brokerKeyFormFields = [
    {
      key: "brokerId",
      label: "Broker",
      type: "select_dynamic",
      required: true,
      placeholder: "Select Broker",
      optionsSourceKey: "allBrokersList",
      optionValueKey: "id",
      optionLabelKey: "name",
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
    // {
    //   key: "token",
    //   label: "Token",
    //   type: "text",
    //   placeholder: "Enter token (optional)",
    // },
    // { key: "tokenDate", label: "Token Date", type: "date" },
    // {
    //   key: "status",
    //   label: "Status",
    //   type: "select",
    //   required: true,
    //   defaultValue: "true",
    //   options: [
    //     { value: "true", label: "Active" },
    //     { value: "false", label: "Inactive" },
    //   ],
    // },
  ];

  const dynamicOptionsForFilters = {
    brokersForFilter: allBrokersData,
  };

  const dynamicOptionsForForms = {
    allBrokersList: allBrokersData,
  };

  return (
    <TableContentManager
      apiEndpoint="/api/broker-key"
      columns={brokerKeyColumns}
      filters={brokerKeyFilters}
      formFields={brokerKeyFormFields}
      itemKeyField="id"
      pageTitle="Broker Key Management"
      canAddItem={true}
      customLink={"https://kite.trade/connect/login?api_key="}
      dynamicFilterOptionsData={dynamicOptionsForFilters}
      dynamicSelectDataSources={dynamicOptionsForForms}
    />
  );
}
