// app/trades/page.js
import TableContentManager from "@/components/CrudTable/TableContentManager";

async function getAllBrokers() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${apiBaseUrl}/api/broker?limit=1000`);
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error("Error fetching brokers:", err);
    return [];
  }
}

export default async function TradeDashboardPage() {
  const allBrokers = await getAllBrokers();

  const tradeColumns = [
    { key: "id", label: "ID", type: "number", sortable: true },
    { key: "Broker.name", label: "Broker", type: "text", sortable: true },
    { key: "User.name", label: "User", type: "text", sortable: true },
    { key: "baseAsset", label: "Base Asset", type: "text", sortable: true },
    { key: "asset", label: "Asset", type: "text", sortable: true },
    {
      key: "price",
      label: "Price",
      type: "currency",
      currency: "INR",
      sortable: true,
    },
    {
      key: "profitAndLoss",
      label: "P&L",
      type: "currency",
      currency: "INR",
      sortable: true,
    },
    {
      key: "direction",
      label: "Direction",
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
      searchable: false,
    },
    { key: "tradeTime", label: "Trade Time", type: "date", sortable: true },
  ];
  const tradeFilters = [
    {
      key: "brokerId",
      label: "Broker",
      type: "select",
      optionsSourceKey: "brokersForFilter",
      optionValueKey: "id",
      optionLabelKey: "name",
    },
  ];

  const tradeFormFields = [
    {
      key: "brokerId",
      label: "Broker",
      type: "select_dynamic",
      required: true,
      optionsSourceKey: "brokersList",
      optionValueKey: "id",
      optionLabelKey: "name",
    },
    // {
    //   key: "userId",
    //   label: "User",
    //   type: "select_dynamic",
    //   required: true,
    //   optionsSourceKey: "usersList",
    //   optionValueKey: "id",
    //   optionLabelKey: "name",
    // },
    {
      key: "baseAsset",
      label: "Base Asset",
      type: "text",
      required: true,
    },
    {
      key: "asset",
      label: "Asset",
      type: "text",
      required: true,
    },
    {
      key: "price",
      label: "Price",
      type: "number",
      required: true,
    },
    {
      key: "profitAndLoss",
      label: "Profit/Loss",
      type: "number",
    },
    {
      key: "tradeTime",
      label: "Trade Time",
      type: "datetime",
      required: true,
    },
    {
      key: "direction",
      label: "Direction",
      type: "select",
      required: true,
      defaultValue: "true",
      options: [
        { value: "buy", label: "Buy" },
        { value: "sell", label: "Sell" },
      ],
    },
  ];

  const dynamicFilterOptionsData = {
    brokersForFilter: allBrokers,
  };

  const dynamicSelectDataSources = {
    brokersList: allBrokers,
  };

  return (
    <TableContentManager
      apiEndpoint="/api/trade"
      columns={tradeColumns}
      filters={tradeFilters}
      formFields={tradeFormFields}
      itemKeyField="id"
      pageTitle="Trade Management"
      canAddItem={true}
      dynamicFilterOptionsData={dynamicFilterOptionsData}
      dynamicSelectDataSources={dynamicSelectDataSources}
    />
  );
}
