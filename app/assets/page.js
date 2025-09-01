// app/assets/page.js - Dark Theme Optimized
import TableContentManager from "@/components/CrudTable/TableContentManager";
import { Coins } from "lucide-react";

export default function AssetPage() {
  const assetColumns = [
    { key: "id", label: "ID", type: "number", sortable: true },
    { key: "name", label: "Asset Name", type: "text", sortable: true },
    { key: "createdAt", label: "Created At", type: "date", sortable: true },
  ];

  const assetFormFields = [
    {
      key: "name",
      label: "Asset Name",
      type: "text",
      required: true,
      placeholder: "Enter asset name (e.g. NIFTY, BANKNIFTY)",
    },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/asset"
      columns={assetColumns}
      formFields={assetFormFields}
      itemKeyField="id"
      pageTitle="Assets"
      canAddItem={true}
    />
  );
}

export const metadata = {
  title: "Asset Management | Algoman Dashboard",
  description: "Manage trading assets and financial instruments",
};
