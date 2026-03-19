import { getCategories } from '@/lib/data/categories';
import { getProducts } from '@/lib/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';

// Define the props for the page, which include the dynamic route parameters.
// The `category` param comes from the folder name `[category]`.
// In Next.js 15+, params is a Promise
type CategoryPageProps = {
  params: Promise<{
    category: string;
    locale: string;
  }>;
};

// This is a dynamic page that displays products for a specific category.
// It's a React Server Component, so we can fetch data directly on the server.
export default async function CategoryPage({ params }: CategoryPageProps) {
  // In Next.js 15+, params is async and must be awaited
  const resolvedParams = await params;

  // Fetch products and categories data in parallel for better performance.
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Find the current category object based on the ID from the URL.
  const currentCategory = categories.find((c) => c.id === resolvedParams.category);

  // If the category ID from the URL is not a valid category, show a 404 page.
  if (!currentCategory) {
    notFound();
  }

  // Filter the full product list to get only those belonging to the current category.
  const categoryProducts = products.filter(
    (p) => p.category === resolvedParams.category
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header: Displays the category name and a brief description. */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold capitalize">{currentCategory.name_fr}</h1>
        <p className="text-gray-500 mt-2">
          {`Découvrez notre sélection de ${currentCategory.name_fr.toLowerCase()}.`}
        </p>
      </header>

      {/* Filter and Sort Controls (UI only, as per prototype specification) */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Filtrer par:</span>
          <Button variant="secondary" className="min-h-0 h-10 px-4 py-2 text-sm">
            Tout ▼
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Trier par:</span>
           <Button variant="secondary" className="min-h-0 h-10 px-4 py-2 text-sm">
            Prix ▼
          </Button>
        </div>
      </div>

      {/* Products Grid: Displays the products or an empty state message. */}
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={resolvedParams.locale} />
          ))}
        </div>
      ) : (
        // Empty state shown if no products are found in this category.
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">
            Aucun produit trouvé dans cette catégorie pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}

// This function tells Next.js which category pages to generate at build time.
// This improves performance by pre-rendering these pages as static HTML.
export async function generateStaticParams() {
  const categories = await getCategories();
 
  // We can assume a default locale for now, like 'fr', for pre-rendering.
  // The i18n library will handle locale detection at runtime.
  return categories.map((category) => ({
    locale: 'fr',
    category: category.id,
  }));
}