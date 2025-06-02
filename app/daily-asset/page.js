// app/dailyAssets/page.js
import TableContentManager from "@/components/CrudTable/TableContentManager";

async function getAllAssets() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${apiBaseUrl}/api/asset?limit=10000`);
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error("Error fetching assets", err);
    return [];
  }
}

export default async function DailyAssetDashboardPage() {
  const allAssets = await getAllAssets();

  const dailyAssetColumns = [
    { key: "id", label: "ID", type: "number", sortable: true },
    { key: "Asset.name", label: "Asset Name", type: "text", sortable: true },
    {
      key: "day",
      label: "day",
      type: "text",
      sortable: true,
    },
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
      key: "assetId",
      label: "Asset",
      type: "select_dynamic",
      required: true,
      optionsSourceKey: "assetsList",
      optionValueKey: "id",
      optionLabelKey: "name",
    },
    {
      key: "day",
      label: "Week Day",
      type: "select",
      required: true,
      defaultValue: "true",
      options: [
        { value: "Monday", label: "Monday" },
        { value: "Tuesday", label: "Tuesday" },
        { value: "Wednesday", label: "Wednesday" },
        { value: "Thursday", label: "Thursday" },
        { value: "Friday", label: "Friday" },
      ],
    },
  ];

  const dynamicFilterOptionsData = {
    assetsForFilter: allAssets,
  };

  const dynamicSelectDataSources = {
    assetsList: allAssets,
  };

  return (
    <TableContentManager
      apiEndpoint="/api/daily-asset"
      columns={dailyAssetColumns}
      filters={dailyAssetFilters}
      formFields={dailyAssetFormFields}
      itemKeyField="id"
      pageTitle="Daily-Asset Management"
      canAddItem={true}
      dynamicFilterOptionsData={dynamicFilterOptionsData}
      dynamicSelectDataSources={dynamicSelectDataSources}
    />
  );
}
