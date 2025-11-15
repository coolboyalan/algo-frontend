'use client';

import { DynamicServerTable } from '@/components/table/dynamic-server-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Plane,
  Clock,
  Users,
  DollarSign,
  PlaneTakeoff,
  PlaneLanding,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableParams, TableResponse } from '@/app/actions/table-data';

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

interface FlightsTableProps {
  initialData: TableResponse<Flight>;
  fetchData: (params: TableParams) => Promise<TableResponse<Flight>>;
}

export function FlightsTable({ initialData, fetchData }: FlightsTableProps) {
const [selectedFlights, setSelectedFlights] = useState<Flight[]>([]);

  // Bulk action handlers
  const handleBulkDelete = async (bookings: Flight[]) => {
    if (confirm(`Delete ${bookings.length} booking(s)?`)) {
      console.log('Deleting:', bookings);
      // Add your delete API call here
      // await deleteFlights(bookings.map(b => b.id));
      alert(`Deleted ${bookings.length} bookings`);
    }
  };


  const columns: ColumnDef<Flight>[] = [
    {
      accessorKey: 'flightNumber',
      header: 'Flight',
      enableSorting: true,
      cell: ({ row }) => {
        const flight = row.original;
        return (
          <div>
            <div className="font-semibold text-primary flex items-center gap-2">
              <Plane className="h-4 w-4" />
              {flight.flightNumber}
            </div>
            <div className="text-sm text-muted-foreground">{flight.airline}</div>
            <div className="text-xs text-muted-foreground">{flight.aircraft}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'from',
      header: 'Route',
      cell: ({ row }) => {
        const flight = row.original;
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PlaneTakeoff className="h-4 w-4 text-green-600" />
              <span className="font-medium">{flight.from}</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full h-px bg-border" />
            </div>
            <div className="flex items-center gap-2">
              <PlaneLanding className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{flight.to}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'departureTime',
      header: 'Schedule',
      enableSorting: true,
      cell: ({ row }) => {
        const flight = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">Dep: {flight.departureTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">Arr: {flight.arrivalTime}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Duration: {flight.duration}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      enableSorting: true,
      cell: ({ row }) => {
        const price = row.original.price;
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600">
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'capacity',
      header: 'Capacity',
      cell: ({ row }) => {
        const flight = row.original;
        const occupancy = flight.capacity > 0 ? (flight.booked / flight.capacity) * 100 : 0;
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {flight.booked}/{flight.capacity}
              </span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  occupancy >= 90 ? 'bg-red-500' :
                  occupancy >= 70 ? 'bg-orange-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${occupancy}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {occupancy.toFixed(0)}% occupied
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === 'scheduled'
                ? 'default'
                : status === 'delayed'
                ? 'secondary'
                : status === 'cancelled'
                ? 'destructive'
                : 'outline'
            }
          >
            {status === 'scheduled' && <CheckCircle2 className="mr-1 h-3 w-3" />}
            {status === 'delayed' && <AlertCircle className="mr-1 h-3 w-3" />}
            {status === 'cancelled' && <XCircle className="mr-1 h-3 w-3" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Edit Flight">
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Flight
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Flights</DropdownMenuItem>
                <DropdownMenuItem>Update Pricing</DropdownMenuItem>
                <DropdownMenuItem>Duplicate Flight</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel Flight
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <DynamicServerTable
      tableKey='flights'
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      searchable
      searchPlaceholder="Search by flight number, airline, or route..."
      searchFields={['flightNumber', 'airline', 'from', 'to']}
      filters={[
        {
          field: 'status',
          label: 'Flight Status',
          type: 'multiselect',
          options: [
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Delayed', value: 'delayed' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Completed', value: 'completed' },
          ],
        },
        {
          field: 'aircraftType',
          label: 'Aircraft Type',
          type: 'multiselect',
          options: [
            { label: 'Boeing 737', value: 'Boeing 737' },
            { label: 'Airbus A320', value: 'Airbus A320' },
            { label: 'Boeing 787', value: 'Boeing 787' },
            { label: 'Airbus A321', value: 'Airbus A321' },
            { label: 'Boeing 777', value: 'Boeing 777' },
          ],
        },
        {
          field: 'airline',
          label: 'Airline',
          type: 'multiselect',
          options: [
            { label: 'Flyomint', value: 'Flyomint' },
            { label: 'Air India', value: 'Air India' },
            { label: 'IndiGo', value: 'IndiGo' },
            { label: 'SpiceJet', value: 'SpiceJet' },
            { label: 'Vistara', value: 'Vistara' },
          ],
        },
      ]}
      defaultSortBy="departureTime"
      defaultSortOrder="asc"
      pageSize={10}
      onRowClick={(row) => console.log('Flight clicked:', row)}
	  pageSizeOptions={[10, 25, 50, 100]}
      exportable={true}
      exportFileName="bookings"
      exportConfig={{
        csv: true,
        excel: true,
        pdf: true,
        print: true,
      }}
      selectable={true}
      rowIdField="id"
      onSelectionChange={setSelectedFlights}
      bulkActions={[
        {
          label: 'Delete',
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleBulkDelete,
          variant: 'destructive',
        },
      ]}
    />
  );
}
