import { Card, CardContent } from '@/components/ui/Card';

export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative w-full aspect-square bg-gray-200 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
