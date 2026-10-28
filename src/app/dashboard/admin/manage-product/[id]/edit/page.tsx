import UpdateProductForm from "@/components/dashboard/ProductUpdate";
import { getProduct } from "@/lib/api/product";

import React from "react";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  return (
    <div className="p-8">
      <UpdateProductForm product={product} />
    </div>
  );
}