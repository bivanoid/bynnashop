import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface CartItem {
  id: number;
  namaBarang: string;
  gambar: string;
  hargaBarang: number;
  diskonBarang: number;
  totalDiskon?: number;
  stokBarang: number;
  qty: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">, qty: number) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalHarga: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "bynnashop_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(item: Omit<CartItem, "qty">, qty: number) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const newQty = Math.min(existing.qty + qty, item.stokBarang);
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: newQty } : i,
        );
      }
      return [...prev, { ...item, qty: Math.min(qty, item.stokBarang) }];
    });
  }

  function removeFromCart(id: number) {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id: number, qty: number) {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.id !== id) return i;
          const clamped = Math.max(1, Math.min(qty, i.stokBarang));
          return { ...i, qty: clamped };
        })
        .filter((i) => i.qty > 0),
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const totalHarga = cartItems.reduce((sum, i) => {
    const harga =
      i.diskonBarang === 0 ? i.hargaBarang : (i.totalDiskon ?? i.hargaBarang);
    return sum + harga * i.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalHarga,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}