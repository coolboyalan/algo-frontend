// app/broker-keys/page.js (Server Component) - SIMPLIFIED
import TableContentManager from "@/components/CrudTable/TableContentManager";
import { Cross } from "lucide-react";

const darkEnumConfig = [
  {
    value: true,
    display: "Active",
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-400",
  },
  {
    value: false,
    display: "Inactive",
    bgColor: "bg-red-500/20",
    textColor: "text-red-400",
  },
];

async function getAllBrokers() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${apiBaseUrl}/api/broker?pagination=false`);
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch {
    return [];
  }
}

export default async function BrokerKeyDashboardPage() {
  const allBrokersData = await getAllBrokers();

  // Simple columns without render functions
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
      key: "timeFrame",
      label: "Time Frame",
      type: "number",
      sortable: true,
      searchable: false,
    },
    {
      key: "profitLimit",
      label: "Profit Limit",
      type: "number",
      sortable: true,
      searchable: false,
    },
    {
      key: "lossLimit",
      label: "Loss Limit",
      type: "number",
      sortable: true,
      searchable: false,
    },
    {
      key: "usableFund",
      label: "Usable Fund",
      type: "number",
      sortable: true,
      searchable: false,
    },
    {
      key: "type",
      label: "Account Type",
      type: "text",
      sortable: true,
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
    {
      key: "timeFrame",
      label: "Time Frame",
      type: "select",
      required: true,
      defaultValue: 5,
      options: [
        { value: 5, label: "5 Minutes" },
        { value: 3, label: "3 Minutes" },
      ],
    },
    {
      key: "type",
      label: "Account Type",
      type: "select",
      required: true,
      defaultValue: "buying",
      options: [
        { value: "buying", label: "Buying" },
        { value: "selling", label: "Selling" },
      ],
    },
    {
      key: "profitLimit",
      label: "Profit Limit",
      type: "number",
      required: true,
      placeholder: "Profit Limit",
    },
    {
      key: "lossLimit",
      label: "Loss Limit",
      type: "number",
      required: true,
      placeholder: "Loss Limit",
    },
    {
      key: "usableFund",
      label: "Usable Fund",
      type: "number",
      required: true,
      placeholder: "Profit Limit",
    },
  ];

  const customActions = [
    {
      icon: <Cross size={16} />,
      actionUrl: "/api/broker-key/stop",
      title: "Stop Trading",
      color: "text-red-400",
      bgColor: "hover:bg-red-500/20",
    },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/admin/broker-key"
      columns={brokerKeyColumns}
      filters={brokerKeyFilters}
      formFields={brokerKeyFormFields}
      itemKeyField="id"
      pageTitle="Broker Key Management"
      canAddItem={true}
      customLink="https://kite.trade/connect/login?api_key="
      dynamicFilterOptionsData={{ brokersForFilter: allBrokersData }}
      dynamicSelectDataSources={{ allBrokersList: allBrokersData }}
      customActions={customActions}
    />
  );
}
