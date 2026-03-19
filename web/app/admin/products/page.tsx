import { getProducts } from '@/lib/data/products';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';

// This is the Admin Products List page. It's a Server Component that fetches
// all products and displays them in a table.
export default async function AdminProductsPage() {
  const products = await getProducts();

  // Helper function to get stock status badge variant.
  const getStockVariant = (status: string) => {
    switch (status) {
      case 'in_stock': return 'success';
      case 'low_stock': return 'warning';
      case 'out_of_stock': return 'danger';
      default: return 'default';
    }
  };

  // Helper function to translate stock status for display.
  const translateStockStatus = (status: string) => {
    switch (status) {
      case 'in_stock': return '✓ En stock';
      case 'low_stock': return '⚠️ Faible';
      case 'out_of_stock': return '❌ Rupture';
      default: return status;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Produits</h1>

      {/* Search and Add Product Controls (UI only as per spec) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input placeholder="Rechercher..." className="max-w-sm" />
        <Button variant="primary">Ajouter produit</Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="relative h-10 w-10 rounded-md overflow-hidden">
                        <Image src={product.image} alt={product.name_fr} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.name_fr}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.price} DZD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge variant={getStockVariant(product.stock_status)}>
                        {translateStockStatus(product.stock_status)}
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
