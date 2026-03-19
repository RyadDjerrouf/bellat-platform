import { getProductById, getProducts } from '@/lib/data/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { AddToCartForm } from '@/components/products/AddToCartForm';

// Define the props for the page, which include the dynamic route parameter `id` and `locale`.
// In Next.js 15+, params is a Promise
type ProductPageProps = {
  params: Promise<{
    id: string;
    locale: string; // Add locale to params
  }>;
};

// This is the Product Detail Page. It's a Server Component that fetches
// data for a single product and displays it.
export default async function ProductPage({ params }: ProductPageProps) {
  // In Next.js 15+, params is async and must be awaited
  const resolvedParams = await params;

  // Fetch the specific product's data using the ID from the URL.
  const product = await getProductById(resolvedParams.id);

  // If no product is found for the given ID, render the 404 page.
  if (!product) {
    notFound();
  }

  // Helper function to translate stock status for display based on locale
  const translateStockStatus = (status: string) => {
    if (resolvedParams.locale === 'ar') {
      switch (status) {
        case 'in_stock': return 'متوفر';
        case 'low_stock': return 'مخزون منخفض';
        case 'out_of_stock': return 'غير متوفر';
        default: return status;
      }
    } else {
      switch (status) {
        case 'in_stock': return 'En stock';
        case 'low_stock': return 'Stock faible';
        case 'out_of_stock': return 'Rupture de stock';
        default: return status;
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Column 1: Product Image */}
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={resolvedParams.locale === 'ar' ? product.name_ar : product.name_fr}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Column 2: Product Details and Actions */}
          <div>
            <h1 className="text-3xl font-bold">
              {resolvedParams.locale === 'ar' ? product.name_ar : product.name_fr}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-2xl font-bold text-bellat-red">{product.price} DZD</p>
              <span className="text-gray-500">/ {product.unit}</span>
            </div>

            <div className="mt-4">
              <Badge variant={product.stock_status === 'in_stock' ? 'success' : 'warning'}>
                {translateStockStatus(product.stock_status)}
              </Badge>
            </div>

            <div className="mt-6 border-t pt-6">
              <h2 className="font-semibold">{resolvedParams.locale === 'ar' ? 'الوصف' : 'Description'}</h2>
              <p className="mt-2 text-gray-600">
                {resolvedParams.locale === 'ar' ? product.description_ar : product.description_fr}
              </p>
            </div>

            {/* Interactive client component for adding to cart */}
            <AddToCartForm product={product} locale={resolvedParams.locale} />
          </div>
        </div>
      </div>
    </div>
  );
}

// This function tells Next.js which product pages to generate at build time.
export async function generateStaticParams() {
  const products = await getProducts();
 
  // Assume a default locale for pre-rendering. The i18n library will
  // handle locale detection for client-side navigation.
  return products.map((product) => ({
    locale: 'fr',
    id: product.id,
  }));
}