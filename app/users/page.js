// app/trades/page.js
import TableContentManager from "@/components/CrudTable/TableContentManager";

export default async function TradeDashboardPage() {
  const userColumns = [
    { key: "id", label: "ID", type: "number", sortable: true },
    { key: "name", label: "Name", type: "text", sortable: true },
    { key: "email", label: "Email", type: "text", sortable: true },
    { key: "role", label: "Asset", type: "text", sortable: true },
  ];

  const userFormFields = [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      key: "email",
      label: "Email",
      type: "text",
      required: true,
    },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/admin/user"
      columns={userColumns}
      formFields={userFormFields}
      itemKeyField="id"
      pageTitle="User Management"
      canAddItem={false}
    />
  );
}
