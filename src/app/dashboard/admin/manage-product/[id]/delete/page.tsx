import { getProduct } from '@/lib/api/product';
import DeleteProductClient from './DeleteProductClient';

export interface DeleteProductProps {
  params: Promise<{ id: string }>;
}

export default async function DeleteProductPage({ params }: DeleteProductProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return <DeleteProductClient product={product} />;
}
