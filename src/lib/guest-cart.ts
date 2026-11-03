const GUEST_CART_KEY = 'mv_guest_cart';

// Product details সহ save kora hoy jate cart page e dekhano jay
export interface GuestCartItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number | null;
    images: string[];
    stock: number;
  };
}

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addToGuestCart(
  productId: string,
  quantity: number,
  productDetails: GuestCartItem['product']
): void {
  const items = getGuestCart();
  const existing = items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
    existing.product = productDetails; // latest details update
  } else {
    items.push({ productId, quantity, product: productDetails });
  }
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function removeFromGuestCart(productId: string): void {
  const items = getGuestCart().filter((i) => i.productId !== productId);
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function updateGuestCartQuantity(productId: string, quantity: number): void {
  const items = getGuestCart();
  const existing = items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity = quantity;
    if (existing.quantity <= 0) {
      removeFromGuestCart(productId);
      return;
    }
  }
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function clearGuestCart(): void {
  localStorage.removeItem(GUEST_CART_KEY);
}

export function getGuestCartCount(): number {
  return getGuestCart().reduce((sum, item) => sum + item.quantity, 0);
}

// syncCartAction er jonno শুধু productId + quantity
export function getGuestCartForSync(): { productId: string; quantity: number }[] {
  return getGuestCart().map(({ productId, quantity }) => ({ productId, quantity }));
}
