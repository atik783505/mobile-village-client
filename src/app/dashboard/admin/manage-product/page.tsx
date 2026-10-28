import ProductTable from "@/components/dashboard/ProductTable";
import { getAllProducts } from "@/lib/api/product";


export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-gray-50/50 py-8">
      <ProductTable initialProducts={products} />
    </main>
  );
}