// app/broker-keys/page.js (Server Component)
import TableContentManager from "@/components/CrudTable/TableContentManager";
import { Cross } from "lucide-react";

async function getAllBrokers() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${apiBaseUrl}/api/broker?pagination=false`);
    if (!response.ok) {
      console.error(
        "Server: Failed to fetch brokers:",
        response.status,
        await response.text(),
      );
      return [];
    }
    const result = await response.json();
    console.log(result.data);
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
    },
    {
      key: "apiSecret",
      label: "API Secret",
      type: "text",
      sortable: false,
      maxWidth: "100px",
      searchable: false,
    },
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
      mobileColumns={["Broker.name", "id"]}
      disableMobilePagination={true}
      customActions={[
        {
          icon: <Cross size={16} />,
          actionUrl: "/api/broker-key/custom-action", // Custom API endpoint
          title: "Custom Action",
          color: "text-purple-600 hover:text-purple-800",
          bgColor: "hover:bg-purple-100",
        },
      ]}
    />
  );
}
