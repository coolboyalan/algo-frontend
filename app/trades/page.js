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

async function getAllAssets() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${apiBaseUrl}/api/base-asset?limit=10000`);
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error("Error fetching assets", err);
    return [];
  }
}

export default async function TradeDashboardPage() {
  const allBrokers = await getAllBrokers();
  const allAssets = await getAllAssets();

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
      key: "quantity",
      label: "Quantity",
      type: "number",
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
    {
      key: "baseAssetId",
      label: "Base Asset",
      type: "select_dynamic",
      required: true,
      optionsSourceKey: "assetList",
      optionValueKey: "id",
      optionLabelKey: "name",
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
    assetsForFilter: allAssets,
  };

  const dynamicSelectDataSources = {
    brokersList: allBrokers,
    assetsList: allAssets,
  };

  return (
    <TableContentManager
      apiEndpoint="/api/trade"
      columns={tradeColumns}
      filters={tradeFilters}
      // formFields={tradeFormFields}
      itemKeyField="id"
      pageTitle="Trade Management"
      canAddItem={false}
      dynamicFilterOptionsData={dynamicFilterOptionsData}
      dynamicSelectDataSources={dynamicSelectDataSources}
    />
  );
}
