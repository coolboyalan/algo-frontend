import { fetchTableData, TableParams } from '@/app/actions/table-data';
import { PaymentsTable } from './payments-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function PaymentsPage() {
  async function fetchData(params: TableParams) {
    'use server';
    return fetchTableData('/api/payments', params);
  }

  const sampleRecord = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    createdAt: new Date().toISOString(),
    amount: 1234,
  };

  const initialData = await fetchTableData('/api/payments', {
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  }, sampleRecord);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Payments Management</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentsTable initialData={initialData} fetchData={fetchData} />
        </CardContent>
      </Card>
    </div>
  );
}
