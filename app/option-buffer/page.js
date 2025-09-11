// app/brokers/page.js - Dark Theme Optimized
import TableContentManager from "@/components/CrudTable/TableContentManager";
import { Building2, Calendar, Hash } from "lucide-react";

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

export default function OptionBufferDashboardPage() {
  // Simplified columns without render functions
  const brokerColumns = [
    { key: "id", label: "ID", type: "number", sortable: true },
    { key: "value", label: "Buffer Value", type: "number", sortable: true },
    { key: "createdAt", label: "Created At", type: "date", sortable: true },
  ];

  const brokerFormFields = [
    {
      key: "value",
      label: "Buffer Value",
      type: "number",
      required: true,
      placeholder: "Enter buffer value (e.g. 100, 300)",
    },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/option-buffer"
      columns={brokerColumns}
      formFields={brokerFormFields}
      itemKeyField="id"
      pageTitle="OptionBuffers"
      canAddItem={true}
    />
  );
}

export const metadata = {
  title: "OptionBuffer Management | Algoman Dashboard",
  description: "Manage supported trading brokers and platforms",
};
