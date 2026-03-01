'use client';

import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProduct() {
  const params = useParams();
  const productId = params.id as string;

  return <ProductForm mode="edit" productId={productId} />;
}
