import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { productService } from "../../../services/productService.js";
import ProductGrid from "../../../components/product/ProductGrid.jsx";
import { IconHeart } from "../../../components/common/Icons.jsx";
import EmptyState from "../../../components/common/EmptyState.jsx";

export default function Wishlist() {
  const ids = useSelector((s) => s.wishlist.items);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(ids.map((id) => productService.getById(id).catch(() => null))).then((res) => {
      setProducts(res.filter(Boolean));
      setLoading(false);
    });
  }, [ids]);

  return (
    <div>
      <h1 className="text-xl font-bold">Wishlist</h1>
      <div className="mt-6">
        {!loading && products.length === 0 ? (
          <EmptyState icon={<IconHeart width={28} height={28} />} title="Nothing saved yet" description="Tap the heart on any product to save it here." />
        ) : (
          <ProductGrid products={products} loading={loading} />
        )}
      </div>
    </div>
  );
}
