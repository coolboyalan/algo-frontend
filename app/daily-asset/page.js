// app/dailyAssets/page.js - Dark Theme Optimized
import TableContentManager from "@/components/CrudTable/TableContentManager";

async function getAllAssets() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${apiBaseUrl}/api/asset?pagination=false`);
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch {
    return [];
  }
}

export default async function DailyAssetDashboardPage() {
  const allAssets = await getAllAssets();

  const dailyAssetColumns = [
    { key: "id", label: "ID", type: "number", sortable: true },
    { key: "day", label: "Day", type: "text", sortable: true },
    { key: "Asset.name", label: "Asset Name", type: "text", sortable: true },
  ];

  const dailyAssetFilters = [
    {
      key: "assetId",
      label: "Asset",
      type: "select",
      optionsSourceKey: "assetsForFilter",
      optionValueKey: "id",
      optionLabelKey: "name",
    },
  ];

  const dailyAssetFormFields = [
    {
      key: "day",
      label: "Week Day",
      type: "select",
      required: true,
      defaultValue: "Monday",
      options: [
        { value: "Monday", label: "Monday" },
        { value: "Tuesday", label: "Tuesday" },
        { value: "Wednesday", label: "Wednesday" },
        { value: "Thursday", label: "Thursday" },
        { value: "Friday", label: "Friday" },
      ],
    },
    {
      key: "assetId",
      label: "Asset",
      type: "select_dynamic",
      required: true,
      placeholder: "Select an asset",
      optionsSourceKey: "assetsList",
      optionValueKey: "id",
      optionLabelKey: "name",
    },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/daily-asset"
      columns={dailyAssetColumns}
      filters={dailyAssetFilters}
      formFields={dailyAssetFormFields}
      itemKeyField="id"
      pageTitle="Daily Assets"
      canAddItem={true}
      dynamicFilterOptionsData={{ assetsForFilter: allAssets }}
      dynamicSelectDataSources={{ assetsList: allAssets }}
    />
  );
}

export const metadata = {
  title: "Daily Asset Management | Algoman Dashboard",
  description: "Manage daily asset allocations and trading schedules",
};
