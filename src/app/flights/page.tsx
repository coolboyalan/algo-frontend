import { fetchTableData, TableParams } from '@/app/actions/table-data';
import { FlightsTable } from './flights-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Users, Clock, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

type Flight = {
  id: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  aircraftType: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  capacity: number;
  booked: number;
  status: 'scheduled' | 'delayed' | 'cancelled' | 'completed';
  createdAt: string;
};

// Sample record for auto-seeding
const sampleFlight: Flight = {
  id: '1',
  flightNumber: 'FO-101',
  airline: 'Flyomint',
  aircraft: 'Boeing 737-800',
  aircraftType: 'Boeing 737',
  from: 'Mumbai (BOM)',
  to: 'Delhi (DEL)',
  departureTime: '06:00 AM',
  arrivalTime: '08:15 AM',
  duration: '2h 15m',
  price: 4500,
  capacity: 180,
  booked: 156,
  status: 'scheduled',
  createdAt: '2025-01-10T10:30:00Z',
};

export default async function FlightsPage() {
  // Fetch initial data with auto-seeding
  const initialData = await fetchTableData<Flight>(
    '/api/flights',
    {
      limit: 10,
      sortBy: 'departureTime',
      sortOrder: 'asc',
    },
    sampleFlight // ← Auto-seed if collection doesn't exist
  );

  // Server action for client-side fetching
  async function fetchFlights(params: TableParams) {
    'use server';
    return fetchTableData<Flight>('/api/flights', params);
  }

  // Calculate stats from initial data
  const totalFlights = initialData.pagination.totalCount || 0;
  const scheduledFlights = initialData.data.filter(f => f.status === 'scheduled').length;
  const delayedFlights = initialData.data.filter(f => f.status === 'delayed').length;
  const totalCapacity = initialData.data.reduce((sum, f) => sum + f.capacity, 0);
  const totalBooked = initialData.data.reduce((sum, f) => sum + f.booked, 0);
  const avgOccupancy = totalCapacity > 0 ? ((totalBooked / totalCapacity) * 100).toFixed(1) : 0;

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-3xl font-bold text-heading flex items-center gap-3">
            <Plane className="h-8 w-8 text-primary" />
            Flight Management
          </h1>
          <p className="text-subheading mt-2">
            Manage flight schedules, pricing, and capacity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFlights}</div>
              <p className="text-xs text-muted-foreground">All flights today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{scheduledFlights}</div>
              <p className="text-xs text-muted-foreground">On-time departures</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delayed</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{delayedFlights}</div>
              <p className="text-xs text-muted-foreground">Running behind</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCapacity}</div>
              <p className="text-xs text-muted-foreground">Available seats</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgOccupancy}%</div>
              <p className="text-xs text-muted-foreground">Seat utilization</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Component */}
        <FlightsTable initialData={initialData} fetchData={fetchFlights} />
      </div>
    </div>
  );
}
