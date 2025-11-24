import { fetchTableData, TableParams } from "@/app/actions/table-data";
import { BookingsTable } from "./bookings-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, CheckCircle2, Clock, XCircle, DollarSign } from "lucide-react";

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
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
};

const sampleBooking: Booking = {
  id: "1",
  bookingId: "BK-12345",
  passengerName: "John Doe",
  email: "john.doe@email.com",
  phone: "+91-98765-43210",
  flightNumber: "FO-101",
  route: "Mumbai (BOM) → Delhi (DEL)",
  departureDate: "2025-01-15",
  seatClass: "Economy",
  amount: 4500,
  paymentStatus: "paid",
  status: "confirmed",
  createdAt: new Date().toISOString(),
};

export default async function BookingsPage() {
  const initialData = await fetchTableData<Booking>(
    "/api/bookings",
    {
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    sampleBooking,
  );

  async function fetchBookings(params: TableParams) {
    "use server";
    return fetchTableData<Booking>("/api/bookings", params);
  }

  // Calculate stats
  const totalBookings = initialData.pagination.totalCount || 0;
  const confirmedBookings = initialData.data.filter(
    (b) => b.status === "confirmed",
  ).length;
  const pendingBookings = initialData.data.filter(
    (b) => b.status === "pending",
  ).length;
  const cancelledBookings = initialData.data.filter(
    (b) => b.status === "cancelled",
  ).length;
  const totalRevenue = initialData.data
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Ticket className="h-8 w-8 text-primary" />
            Bookings Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all flight bookings and reservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {confirmedBookings}
              </div>
              <p className="text-xs text-muted-foreground">Active bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingBookings}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {cancelledBookings}
              </div>
              <p className="text-xs text-muted-foreground">
                Cancelled bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">Total paid amount</p>
            </CardContent>
          </Card>
        </div>

        {/* Table - Now super simple! */}
        <BookingsTable initialData={initialData} fetchData={fetchBookings} />
      </div>
    </div>
  );
}
