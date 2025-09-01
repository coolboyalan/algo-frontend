// app/trades/page.js - Dark Theme Optimized
import TableContentManager from "@/components/CrudTable/TableContentManager";
import { TrendingUp, Building, User } from "lucide-react";

const darkEnumConfig = [
  {
    value: "buy",
    display: "Buy",
    bgColor: "bg-emerald-500/20 border border-emerald-500/30",
    textColor: "text-emerald-400",
  },
  {
    value: "sell",
    display: "Sell",
    bgColor: "bg-red-500/20 border border-red-500/30",
    textColor: "text-red-400",
  },
];

async function fetchData(endpoint) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function TradeDashboardPage() {
  const [allBrokers, allAssets] = await Promise.all([
    fetchData("/api/broker?pagination=false"),
    fetchData("/api/base-asset?limit=10000"),
  ]);

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
    { key: "quantity", label: "Quantity", type: "number", sortable: true },
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
      enumConfig: darkEnumConfig,
      sortable: true,
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

  return (
    <TableContentManager
      apiEndpoint="/api/trade"
      columns={tradeColumns}
      filters={tradeFilters}
      itemKeyField="id"
      pageTitle="Trades"
      canAddItem={false}
      dynamicFilterOptionsData={{
        brokersForFilter: allBrokers,
        assetsForFilter: allAssets,
      }}
      dynamicSelectDataSources={{
        brokersList: allBrokers,
        assetsList: allAssets,
      }}
    />
  );
}

export const metadata = {
  title: "Trade Management | Algoman Dashboard",
  description: "Monitor and analyze all your trading activities",
};
