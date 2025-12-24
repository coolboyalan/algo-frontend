import { fetchTableData, TableParams } from "@/app/actions/table-data";
import { UserTable, UserItem } from "./users-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, User, Calendar } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function UserPage() {
  const initialData = await fetchTableData<UserItem>("/api/user", {
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  async function fetchUserData(params: TableParams) {
    "use server";
    return fetchTableData<UserItem>("/api/user", params);
  }

  // Calculate stats
  const totalUsers =
    initialData.pagination.totalCount || initialData.data.length;
  const adminCount = initialData.data.filter((u) => u.role === "admin").length;
  const userCount = initialData.data.filter((u) => u.role === "user").length;

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage users, roles, and permissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                All registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {adminCount}
              </div>
              <p className="text-xs text-muted-foreground">Admin users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Regular Users
              </CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {userCount}
              </div>
              <p className="text-xs text-muted-foreground">Standard users</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <UserTable initialData={initialData} fetchData={fetchUserData} />
      </div>
    </div>
  );
}
