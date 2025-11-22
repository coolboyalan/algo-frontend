import { fetchTableData, TableParams } from '@/app/actions/table-data';
import { PaymentsTable } from './payments-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CheckCircle, XCircle, DollarSign, Users } from 'lucide-react';

export type PaymentsItem = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  amount: number;
};

const samplePayments: PaymentsItem = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  status: 'active',
  createdAt: new Date().toISOString(),
  amount: 1000,
};

export default async function PaymentsPage() {
  const initialData = await fetchTableData<PaymentsItem>(
    '/api/payments',
    {
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    samplePayments
  );

  async function fetchPaymentsData(params: TableParams) {
    'use server';
    return fetchTableData<PaymentsItem>('/api/payments', params);
  }

  const totalItems = initialData.pagination.totalCount || 0;
  const activeItems = initialData.data.filter(item => item.status === 'active').length;
  const inactiveItems = initialData.data.filter(item => item.status === 'inactive').length;
  const pendingItems = initialData.data.filter(item => item.status === 'pending').length;
  const totalAmount = initialData.data.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Payments Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all payments records
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">All time records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeItems}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{inactiveItems}</div>
              <p className="text-xs text-muted-foreground">Currently inactive</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-muted-foreground">Sum of all amounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <PaymentsTable initialData={initialData} fetchData={fetchPaymentsData} />
      </div>
    </div>
  );
}
