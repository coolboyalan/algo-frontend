'use client';

import { DynamicServerTable } from '@/components/table/dynamic-server-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  MoreHorizontal,
  Plane,
  Clock,
  Users,
  DollarSign,
  PlaneTakeoff,
  PlaneLanding,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  DollarSignIcon,
  Trash2,
  ListOrdered
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
import { FormFieldConfig } from '@/components/forms/auto-form-generator';

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
  const handleBulkDelete = async (flights: Flight[]) => {
    if (confirm(`Delete ${flights.length} flight(s)?`)) {
      console.log('Deleting:', flights);
      alert(`Deleted ${flights.length} flights`);
    }
  };

  const handleBulkUpdateStatus = async (flights: Flight[]) => {
    console.log('Updating status:', flights);
    alert(`Updated status for ${flights.length} flights`);
  };

  // Form fields for Add/Edit
  const flightFormFields: FormFieldConfig[] = [
    {
      name: 'flightNumber',
      label: 'Flight Number',
      type: 'text',
      required: true,
      placeholder: 'e.g., FO-101',
    },
    {
      name: 'airline',
      label: 'Airline',
      type: 'select',
      required: true,
      options: [
        { label: 'Flyomint', value: 'Flyomint' },
        { label: 'Air India', value: 'Air India' },
        { label: 'IndiGo', value: 'IndiGo' },
        { label: 'SpiceJet', value: 'SpiceJet' },
        { label: 'Vistara', value: 'Vistara' },
      ],
    },
    {
      name: 'aircraft',
      label: 'Aircraft',
      type: 'text',
      required: true,
      placeholder: 'e.g., Boeing 737-800',
    },
    {
      name: 'aircraftType',
      label: 'Aircraft Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Boeing 737', value: 'Boeing 737' },
        { label: 'Airbus A320', value: 'Airbus A320' },
        { label: 'Boeing 787', value: 'Boeing 787' },
        { label: 'Airbus A321', value: 'Airbus A321' },
        { label: 'Boeing 777', value: 'Boeing 777' },
      ],
    },
    {
      name: 'from',
      label: 'From',
      type: 'text',
      required: true,
      placeholder: 'e.g., Mumbai (BOM)',
    },
    {
      name: 'to',
      label: 'To',
      type: 'text',
      required: true,
      placeholder: 'e.g., Delhi (DEL)',
    },
    {
      name: 'departureTime',
      label: 'Departure Time',
      type: 'text',
      required: true,
      placeholder: 'e.g., 06:00 AM',
    },
    {
      name: 'arrivalTime',
      label: 'Arrival Time',
      type: 'text',
      required: true,
      placeholder: 'e.g., 08:15 AM',
    },
    {
      name: 'duration',
      label: 'Duration',
      type: 'text',
      required: true,
      placeholder: 'e.g., 2h 15m',
    },
    {
      name: 'price',
      label: 'Price (₹)',
      type: 'number',
      required: true,
      placeholder: 'Enter base price',
    },
    {
      name: 'capacity',
      label: 'Capacity',
      type: 'number',
      required: true,
      placeholder: 'Total seats',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Delayed', value: 'delayed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ],
    },
  ];

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
            <div className="text-xs text-muted-foreground">Duration: {flight.duration}</div>
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
            <span className="font-semibold text-green-600">₹{price.toLocaleString('en-IN')}</span>
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
                  occupancy >= 90
                    ? 'bg-red-500'
                    : occupancy >= 70
                    ? 'bg-orange-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${occupancy}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">{occupancy.toFixed(0)}% occupied</div>
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
      cell: ({ row }) => {
        const flight = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Flight Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('View bookings', flight)}>
                <ListOrdered className="mr-2 h-4 w-4" />
                View Bookings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Update pricing', flight)}>
                <DollarSignIcon className="mr-2 h-4 w-4" />
                Update Pricing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Duplicate flight', flight)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Flight
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => console.log('Cancel flight', flight)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel Flight
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DynamicServerTable
      tableKey="flights"
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      apiEndpoint="/api/flights"
      formFields={flightFormFields}
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
      pageSizeOptions={[10, 25, 50, 100]}
      exportable
      exportFileName="flights"
      exportConfig={{
        csv: true,
        excel: true,
        pdf: true,
        print: true,
      }}
      selectable
      rowIdField="id"
      onSelectionChange={setSelectedFlights}
      bulkActions={[
        {
          label: 'Update Status',
          icon: <CheckCircle2 className="h-4 w-4" />,
          onClick: handleBulkUpdateStatus,
          variant: 'default',
        },
        {
          label: 'Delete',
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleBulkDelete,
          variant: 'destructive',
        },
      ]}
      viewerTitle="Flight"
      viewerSubtitle="Complete flight information"
      showAddButton
      addButtonLabel="Add Flight"
      showEditButton
      showDeleteButton
    />
  );
}
