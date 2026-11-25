import CheckoutClient from './CheckoutClient';
import { getCartAction } from '@/lib/api/cart';
import { CartData } from '@/types';
import { unstable_noStore as noStore } from 'next/cache';

export default async function CheckoutPage() {
  noStore();

  // Logged-in user er cart server e fetch koro
  // Guest hole null ashbe — client localStorage theke nebe
  let serverCart: CartData | null = null;
  try {
    const res = await getCartAction();
    if (res.success && res.data) {
      const raw = res.data as CartData;
      serverCart = {
        ...raw,
        items: raw.items?.filter((i) => i.product != null) ?? [],
      };
    }
  } catch {
    serverCart = null;
  }

  return <CheckoutClient serverCart={serverCart} />;
}
