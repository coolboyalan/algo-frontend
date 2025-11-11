'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Plane,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Star,
  Percent,
  Globe,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Ticket,
  CreditCard,
  MessageSquare,
  XCircle,
  Target,
  Activity
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  // Real-time metrics
  const metrics = {
    revenue: {
      today: 2450000,
      yesterday: 2150000,
      change: 13.9,
      monthly: 72800000,
      target: 80000000,
    },
    bookings: {
      today: 342,
      yesterday: 298,
      change: 14.8,
      pending: 45,
      confirmed: 297,
    },
    flights: {
      active: 28,
      scheduled: 156,
      delayed: 5,
      cancelled: 2,
      onTime: 92.3,
    },
    passengers: {
      today: 8543,
      thisWeek: 48721,
      thisMonth: 187654,
      satisfaction: 4.6,
    },
    loadFactor: {
      current: 84.2,
      target: 85.0,
      change: 2.3,
    },
  };

  // Recent bookings
  const recentBookings = [
    { id: 'BK-45789', passenger: 'Rahul Sharma', flight: 'FO-101', route: 'BOM → DEL', amount: 4500, status: 'confirmed' },
    { id: 'BK-45790', passenger: 'Priya Patel', flight: 'FO-202', route: 'DEL → BLR', amount: 5200, status: 'pending' },
    { id: 'BK-45791', passenger: 'Amit Kumar', flight: 'FO-303', route: 'BOM → LHR', amount: 45000, status: 'confirmed' },
    { id: 'BK-45792', passenger: 'Sneha Singh', flight: 'FO-404', route: 'BLR → HYD', amount: 3200, status: 'confirmed' },
    { id: 'BK-45793', passenger: 'Vikram Reddy', flight: 'FO-505', route: 'DEL → DXB', amount: 18000, status: 'pending' },
  ];

  // Active flights
  const activeFlights = [
    { flight: 'FO-101', route: 'Mumbai → Delhi', status: 'on-time', departure: '06:00 AM', passengers: 180, capacity: 180 },
    { flight: 'FO-202', route: 'Delhi → Bangalore', status: 'boarding', departure: '10:30 AM', passengers: 156, capacity: 166 },
    { flight: 'FO-303', route: 'Mumbai → London', status: 'delayed', departure: '02:30 PM', passengers: 298, capacity: 310 },
    { flight: 'FO-404', route: 'Bangalore → Hyderabad', status: 'on-time', departure: '05:45 PM', passengers: 201, capacity: 216 },
  ];

  // Top routes
  const topRoutes = [
    { route: 'Mumbai → Delhi', bookings: 1234, revenue: 5543200, occupancy: 87 },
    { route: 'Delhi → Bangalore', bookings: 987, revenue: 4935000, occupancy: 84 },
    { route: 'Mumbai → Dubai', bookings: 756, revenue: 13608000, occupancy: 91 },
  ];

  // Alerts
  const alerts = [
    { id: 1, type: 'warning', message: 'Flight FO-303 delayed by 30 minutes due to weather', time: '5m ago' },
    { id: 2, type: 'urgent', message: '5 customer complaints pending response', time: '15m ago' },
    { id: 3, type: 'info', message: 'New promotional campaign SUMMER2025 scheduled', time: '1h ago' },
  ];

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-heading">Dashboard</h1>
              <p className="text-subheading mt-2">
                Welcome back! Here's what's happening with Flyomint today
              </p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Last updated: just now</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.revenue.today)}</div>
              <div className="flex items-center gap-2 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  +{metrics.revenue.change}% from yesterday
                </span>
              </div>
              <Progress
                value={(metrics.revenue.monthly / metrics.revenue.target) * 100}
                className="mt-3 h-1"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Monthly: {formatCurrency(metrics.revenue.monthly)} / {formatCurrency(metrics.revenue.target)}
              </p>
            </CardContent>
          </Card>

          {/* Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.bookings.today}</div>
              <div className="flex items-center gap-2 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  +{metrics.bookings.change}% from yesterday
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-muted-foreground">{metrics.bookings.confirmed} confirmed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-orange-600" />
                  <span className="text-xs text-muted-foreground">{metrics.bookings.pending} pending</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Flights */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Flights</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.flights.active}</div>
              <div className="flex items-center gap-2 mt-1">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">
                  {metrics.flights.scheduled} scheduled today
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{metrics.flights.onTime}%</div>
                  <div className="text-xs text-muted-foreground">On-time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{metrics.flights.delayed}</div>
                  <div className="text-xs text-muted-foreground">Delayed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{metrics.flights.cancelled}</div>
                  <div className="text-xs text-muted-foreground">Cancelled</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passengers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Passengers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metrics.passengers.today)}</div>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium">
                  {metrics.passengers.satisfaction}/5.0 satisfaction
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span>This week: {formatNumber(metrics.passengers.thisWeek)}</span>
                <span>Month: {formatNumber(metrics.passengers.thisMonth)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertCircle className="h-5 w-5" />
                Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
                  {alert.type === 'urgent' && <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                  {alert.type === 'warning' && <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />}
                  {alert.type === 'info' && <Activity className="h-5 w-5 text-blue-600 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Active Flights */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Active Flights</CardTitle>
              <CardDescription>Currently operating and boarding flights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeFlights.map((flight) => (
                  <div key={flight.flight} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <Plane className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{flight.flight}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {flight.route}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{flight.departure}</div>
                        <div className="text-xs text-muted-foreground">
                          {flight.passengers}/{flight.capacity} seats
                        </div>
                      </div>
                      <Badge
                        variant={
                          flight.status === 'on-time'
                            ? 'default'
                            : flight.status === 'boarding'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {flight.status === 'on-time' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {flight.status === 'boarding' && <Clock className="mr-1 h-3 w-3" />}
                        {flight.status === 'delayed' && <XCircle className="mr-1 h-3 w-3" />}
                        {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Flights
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Load Factor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Load Factor</span>
                  <span className="text-sm font-bold">{metrics.loadFactor.current}%</span>
                </div>
                <Progress value={metrics.loadFactor.current} className="h-2" />
                <div className="flex items-center gap-2 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{metrics.loadFactor.change}% from last month</span>
                </div>
              </div>

              {/* Monthly Revenue Target */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Target</span>
                  <span className="text-sm font-bold">
                    {((metrics.revenue.monthly / metrics.revenue.target) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(metrics.revenue.monthly / metrics.revenue.target) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(metrics.revenue.target - metrics.revenue.monthly)} remaining
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-4">
                <Button variant="outline" className="w-full justify-start">
                  <Ticket className="mr-2 h-4 w-4" />
                  New Booking
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plane className="mr-2 h-4 w-4" />
                  Add Flight
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Percent className="mr-2 h-4 w-4" />
                  Create Promotion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest flight reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{booking.passenger}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{booking.id}</span>
                        <span>•</span>
                        <span>{booking.flight}</span>
                        <span>•</span>
                        <span>{booking.route}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">₹{booking.amount.toLocaleString('en-IN')}</div>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="mt-1">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Routes */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Routes</CardTitle>
              <CardDescription>Most profitable routes today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topRoutes.map((route, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{route.route}</div>
                        <div className="text-sm text-muted-foreground">{route.bookings} bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{formatCurrency(route.revenue)}</div>
                      <div className="text-xs text-muted-foreground">{route.occupancy}% occupancy</div>
                    </div>
                  </div>
                  <Progress value={route.occupancy} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
