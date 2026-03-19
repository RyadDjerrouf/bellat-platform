import { getMockOrders } from '@/lib/data/mock-orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import Link from 'next/link';

// This is the Admin Orders List page. It's a Server Component that fetches
// all mock orders and displays them in a paginated table.
export default async function AdminOrdersPage() {
  const orders = await getMockOrders();

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
      <h1 className="text-3xl font-bold mb-6">Commandes</h1>

      {/* Search, Filter, Export Controls (UI only as per spec) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input placeholder="Rechercher..." className="max-w-sm" />
        <div className="flex gap-2">
          <Button variant="secondary">Filtrer ▼</Button>
          <Button variant="secondary">Exporter</Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N°
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {/* Link to order detail page (non-functional in prototype) */}
                      <Link href={`/admin/orders/${order.id}`} className="text-bellat-red hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(order.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.total} DZD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge variant={getStatusVariant(order.status)}>
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
