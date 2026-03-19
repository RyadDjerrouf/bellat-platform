import { Badge } from '@/components/ui/Badge';

interface StockBadgeProps {
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  locale?: 'fr' | 'ar';
  className?: string;
}

export function StockBadge({ status, locale = 'fr', className = '' }: StockBadgeProps) {
  const statusConfig = {
    in_stock: {
      fr: '✓ En stock',
      ar: '✓ متوفر',
      className: 'bg-green-100 text-green-800'
    },
    low_stock: {
      fr: '⚠ Stock faible',
      ar: '⚠ كمية قليلة',
      className: 'bg-yellow-100 text-yellow-800'
    },
    out_of_stock: {
      fr: '✗ Rupture',
      ar: '✗ نفد المخزون',
      className: 'bg-red-100 text-red-800'
    }
  };

  const config = statusConfig[status];
  const text = config[locale];

  return (
    <Badge className={`text-xs font-medium ${config.className} ${className}`}>
      {text}
    </Badge>
  );
}