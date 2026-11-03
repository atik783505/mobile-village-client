import CartView from '@/components/AllCart';
import { getCartAction } from '@/lib/api/cart';
import { CartData } from '@/types';

// Server component — cart data server e fetch kore client e pass kore
export default async function CartPage() {
  // Server side e session thakle cart fetch kora hoy
  // na thakle null pass kora hoy, client localStorage theke dhekaabe
  let serverCart: CartData | null = null;
  try {
    const res = await getCartAction();
    if (res.success && res.data) {
      const raw = res.data as CartData;
      // product null/undefined hole filter kore dao
      serverCart = {
        ...raw,
        items: raw.items?.filter((item) => item.product != null) ?? [],
      };
    }
  } catch {
    // Login na thakle error ashte pare — guest mode e cholbe
    serverCart = null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <CartView serverCart={serverCart} />
    </div>
  );
}
