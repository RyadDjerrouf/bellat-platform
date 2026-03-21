"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProductById } from '@/lib/api';
import { ProductForm } from '../../_components/ProductForm';

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Parameters<typeof ProductForm>[0]['initial']>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductById(id).then((p) => {
      if (p) {
        setInitial({
          nameFr:        p.name_fr,
          nameAr:        p.name_ar,
          descriptionFr: p.description_fr,
          descriptionAr: p.description_ar,
          categoryId:    p.category,
          // Avoid overriding with the placeholder image that was injected by normalizeProduct
          imageUrl:      p.image === '/images/placeholder.jpg' ? '' : p.image,
          price:         p.price,
          unit:          p.unit,
          stockStatus:   p.stock_status,
        });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!initial) return <p className="text-gray-500">Produit introuvable.</p>;

  return <ProductForm productId={id} initial={initial} />;
}
