// app/broker-keys/page.js (Server Component) - SIMPLIFIED & DARK
import TableContentManager from "@/components/CrudTable/TableContentManager";
import { Cross, Key } from "lucide-react";

// Dark theme enum config - simplified
const darkEnumConfig = [
  {
    value: true,
    display: "Active",
    bgColor: "bg-emerald-500/20 border border-emerald-500/30",
    textColor: "text-emerald-400",
  },
  {
    value: false,
    display: "Inactive",
    bgColor: "bg-red-500/20 border border-red-500/30",
    textColor: "text-red-400",
  },
];

// Simplified broker fetch
async function getAllBrokers() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${apiBaseUrl}/api/broker?pagination=false`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch {
    return [];
  }
}

export default async function BrokerKeyDashboardPage() {
  const allBrokersData = await getAllBrokers();

  // Simplified columns WITHOUT render functions
  const brokerKeyColumns = [
    {
      key: "id",
      label: "ID",
      type: "number",
      sortable: true,
      searchable: false,
    },
    { key: "Broker.name", label: "Broker Name", type: "text", sortable: true },
    { key: "User.name", label: "User Name", type: "text", sortable: true },
    { key: "redirectUrl", label: "Redirect URL", type: "text" },
    {
      key: "apiKey",
      label: "API Key",
      type: "text",
      sortable: false,
      searchable: false,
    },
    {
      key: "apiSecret",
      label: "API Secret",
      type: "text",
      sortable: false,
      searchable: false,
    },
    {
      key: "timeFrame",
      label: "Time Frame",
      type: "number",
      sortable: true,
      searchable: false,
    },
    {
      key: "status",
      label: "Status",
      type: "enum",
      enumConfig: darkEnumConfig,
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
      placeholder: "Select a broker platform",
      optionsSourceKey: "allBrokersList",
      optionValueKey: "id",
      optionLabelKey: "name",
    },
    {
      key: "apiKey",
      label: "API Key",
      type: "text",
      required: true,
      placeholder: "Enter your broker API key",
    },
    {
      key: "apiSecret",
      label: "API Secret",
      type: "password",
      required: true,
      placeholder: "Enter your broker API secret",
    },
    {
      key: "timeFrame",
      label: "Trading Time Frame",
      type: "select",
      required: true,
      defaultValue: 5,
      options: [
        { value: 5, label: "5 Minutes - High Frequency" },
        { value: 3, label: "3 Minutes - Ultra Fast" },
      ],
    },
  ];

  const customActions = [
    {
      icon: <Cross size={16} />,
      actionUrl: "/api/broker-key/stop",
      method: "PUT",
      title: "Stop Trading",
      color: "text-red-400 hover:text-red-300",
      bgColor: "hover:bg-red-500/20",
    },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/broker-key"
      columns={brokerKeyColumns}
      filters={brokerKeyFilters}
      formFields={brokerKeyFormFields}
      itemKeyField="id"
      pageTitle="Broker Keys"
      canAddItem={true}
      customLink="https://kite.trade/connect/login?api_key="
      dynamicFilterOptionsData={{ brokersForFilter: allBrokersData }}
      dynamicSelectDataSources={{ allBrokersList: allBrokersData }}
      mobileColumns={["Broker.name", "status", "timeFrame"]}
      disableMobilePagination={true}
      customActions={customActions}
    />
  );
}

export const metadata = {
  title: "Broker Key Management | Algoman Dashboard",
  description:
    "Manage your trading broker API keys, configure time frames, and monitor connection status.",
};
