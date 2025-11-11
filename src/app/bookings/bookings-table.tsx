'use client';

import { useState } from 'react';
import { DynamicServerTable } from '@/components/table/dynamic-server-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  User,
  Plane,
  DollarSign,
  Mail,
  Phone,
  CheckCircle
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

type Booking = {
  id: string;
  bookingId: string;
  passengerName: string;
  email: string;
  phone: string;
  flightNumber: string;
  route: string;
  departureDate: string;
  seatClass: string;
  amount: number;
  paymentStatus: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
};

interface BookingsTableProps {
  initialData: TableResponse<Booking>;
  fetchData: (params: TableParams) => Promise<TableResponse<Booking>>;
}

export function BookingsTable({ initialData, fetchData }: BookingsTableProps) {
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);

  // Bulk action handlers
  const handleBulkDelete = async (bookings: Booking[]) => {
    if (confirm(`Delete ${bookings.length} booking(s)?`)) {
      console.log('Deleting:', bookings);
      // Add your delete API call here
      // await deleteBookings(bookings.map(b => b.id));
      alert(`Deleted ${bookings.length} bookings`);
    }
  };

  const handleBulkEmail = async (bookings: Booking[]) => {
    console.log('Sending emails to:', bookings);
    alert(`Sending confirmation emails to ${bookings.length} passengers`);
  };

  const handleBulkConfirm = async (bookings: Booking[]) => {
    console.log('Confirming:', bookings);
    alert(`Confirmed ${bookings.length} bookings`);
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="font-semibold">{row.original.id}</div>
      ),
    },
	  {
      accessorKey: 'bookingId',
      header: 'Booking ID',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="font-semibold text-primary">{row.original.bookingId}</div>
      ),
    },
    {
      accessorKey: 'passengerName',
      header: 'Passenger',
      enableSorting: true,
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div>
            <div className="font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {booking.passengerName}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {booking.email}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {booking.phone}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'flightNumber',
      header: 'Flight',
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div>
            <div className="font-medium flex items-center gap-2">
              <Plane className="h-4 w-4 text-primary" />
              {booking.flightNumber}
            </div>
            <div className="text-sm text-muted-foreground">{booking.route}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {booking.departureDate}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'seatClass',
      header: 'Class',
      cell: ({ row }) => {
        const seatClass = row.original.seatClass;
        return (
          <Badge variant="outline" className="font-medium">
            {seatClass}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      enableSorting: true,
      cell: ({ row }) => {
        const amount = row.original.amount;
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => {
        const paymentStatus = row.original.paymentStatus;
        return (
          <Badge
            variant={
              paymentStatus === 'paid'
                ? 'default'
                : paymentStatus === 'pending'
                ? 'secondary'
                : 'destructive'
            }
          >
            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
          </Badge>
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
              status === 'confirmed'
                ? 'default'
                : status === 'pending'
                ? 'secondary'
                : 'destructive'
            }
          >
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
            <Button variant="ghost" size="icon" title="Edit Booking">
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
                  Edit Booking
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Send Confirmation Email</DropdownMenuItem>
                <DropdownMenuItem>Download Ticket</DropdownMenuItem>
                <DropdownMenuItem>Print Boarding Pass</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel Booking
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
      initialData={initialData}
      columns={columns}
      fetchData={fetchData}
      searchable
      searchPlaceholder="Search by passenger name, booking ID, email, or phone..."
      searchFields={['passengerName', 'bookingId', 'email', 'phone']}
      filters={[
        {
          field: 'status',
          label: 'Booking Status',
          type: 'multiselect',
          options: [
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Pending', value: 'pending' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
        },
        {
          field: 'paymentStatus',
          label: 'Payment Status',
          type: 'multiselect',
          options: [
            { label: 'Paid', value: 'paid' },
            { label: 'Pending', value: 'pending' },
            { label: 'Failed', value: 'failed' },
          ],
        },
        {
          field: 'seatClass',
          label: 'Class',
          type: 'multiselect',
          options: [
            { label: 'Economy', value: 'Economy' },
            { label: 'Business', value: 'Business' },
            { label: 'First Class', value: 'First Class' },
          ],
        },
      ]}
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
      pageSize={10}
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
      onSelectionChange={setSelectedBookings}
      bulkActions={[
        {
          label: 'Confirm',
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: handleBulkConfirm,
          variant: 'default',
        },
        {
          label: 'Send Email',
          icon: <Mail className="h-4 w-4" />,
          onClick: handleBulkEmail,
          variant: 'outline',
        },
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
