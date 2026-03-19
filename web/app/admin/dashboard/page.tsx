import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getMockOrders } from '@/lib/data/mock-orders';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { ShoppingCart, DollarSign, Clock, TrendingUp } from 'lucide-react';

// This is the Admin Dashboard page. It's a Server Component that fetches
// mock data to display an overview of the platform's activity.
export default async function AdminDashboardPage() {
  // Fetch all mock orders.
  const orders = await getMockOrders();

  // Static metrics as per the functional specification.
  const ordersToday = 12;
  const revenueToday = 15240;
  const pendingOrders = 5;

  // Get the 5 most recent orders for the "Recent Orders" table.
  // Sort by date (newest first) and take the first 5.
  const recentOrders = orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Helper function to get status badge variant based on order status.
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  // Helper function to translate order status for display.
  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ En attente';
      case 'confirmed': return '✓ Confirmé';
      case 'preparing': return '📦 En préparation';
      case 'out_for_delivery': return '🚚 En livraison';
      case 'delivered': return '✅ Livré';
      case 'cancelled': return '❌ Annulé';
      default: return status;
    }
  };

  return (
    <div>
      {/* Header with gradient */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* Modern Stats Cards with icons and gradients */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Orders Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent rounded-bl-[100px]"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Commandes aujourd&apos;hui</p>
                <p className="text-4xl font-bold text-gray-900">{ordersToday}</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12% vs hier</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/10 to-transparent rounded-bl-[100px]"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Revenus aujourd&apos;hui</p>
                <p className="text-4xl font-bold text-gray-900">{revenueToday.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">DZD</p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-amber-500/10 to-transparent rounded-bl-[100px]"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Commandes en attente</p>
                <p className="text-4xl font-bold text-gray-900">{pendingOrders}</p>
                <p className="text-sm text-amber-600 mt-2 font-medium">Nécessite attention</p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Recent Orders Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-linear-to-r from-gray-50 to-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Commandes récentes</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Dernières transactions de vos clients</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
            >
              Voir tout →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    N° Commande
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center mr-3 text-gray-700 font-semibold text-sm">
                          {order.customer_name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{order.customer_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(order.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{order.total.toLocaleString()} DZD</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <Badge variant={getStatusVariant(order.status)} className="font-medium">
                        {translateStatus(order.status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
