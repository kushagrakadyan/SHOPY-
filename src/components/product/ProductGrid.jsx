import ProductCard from "./ProductCard.jsx";
import { ProductCardSkeleton } from "../common/Loader.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { IconBox } from "../common/Icons.jsx";

export default function ProductGrid({ products, loading, skeletonCount = 8, emptyMessage = "No products match your filters." }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return <EmptyState icon={<IconBox width={32} height={32} />} title="No products found" description={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
