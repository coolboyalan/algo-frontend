// app/assets/page.js - Dark Theme Optimized
import TableContentManager from "@/components/CrudTable/TableContentManager";
import { Coins } from "lucide-react";

export default function AssetDashboardPage() {
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
    <div className="space-y-6">
      {/* Dark Theme Header */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Coins size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Asset Management
            </h1>
            <p className="text-slate-400 text-sm">
              Manage trading assets and instruments
            </p>
          </div>
        </div>
      </div>

      {/* Table Component */}
      <TableContentManager
        apiEndpoint="/api/asset"
        columns={assetColumns}
        formFields={assetFormFields}
        itemKeyField="id"
        pageTitle="Assets"
        canAddItem={true}
      />
    </div>
  );
}

export const metadata = {
  title: "Asset Management | Algoman Dashboard",
  description: "Manage trading assets and instruments",
};
