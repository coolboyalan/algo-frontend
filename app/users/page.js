// app/users/page.js - Dark Theme Optimized
import TableContentManager from "@/components/CrudTable/TableContentManager";
import { Users, Mail, User, UserCheck } from "lucide-react";

export default async function UserDashboardPage() {
  const userColumns = [
    { key: "id", label: "ID", type: "number", sortable: true },
    { key: "name", label: "Name", type: "text", sortable: true },
    { key: "email", label: "Email", type: "text", sortable: true },
    { key: "role", label: "Role", type: "text", sortable: true },
  ];

  const userFormFields = [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/admin/user"
      columns={userColumns}
      formFields={userFormFields}
      itemKeyField="id"
      pageTitle="Users"
      canAddItem={false}
    />
  );
}

export const metadata = {
  title: "User Management | Algoman Dashboard",
  description: "Manage user accounts, roles and permissions",
};
