import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '@/services/cartService';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await cartService.getCart();

      console.log('📥 Loading cart from backend:', response);

      if (response.success && response.data) {
        // Map backend cart items to frontend format
        const backendItems = response.data.cart.items || [];
        console.log('🔍 Backend cart items:', backendItems);

        const frontendItems = backendItems
          .filter((item: any) => {
            const hasProduct = !!item.product?.id;
            if (!hasProduct) {
              console.warn('⚠️ Filtering out item without product:', item);
            }
            return hasProduct;
          })
          .map((item: any) => {
            const mappedItem = {
              id: item.product.id,
              name: item.product.name || 'Unknown Product',
              price: parseFloat(item.product.price || '0'),
              quantity: item.quantity,
              image: item.product.imageUrl || '',
            };
            console.log('🔄 Mapped cart item:', { original: item, mapped: mappedItem });
            return mappedItem;
          });

        console.log('✅ Setting cart items:', frontendItems);
        setItems(frontendItems);
      } else {
        console.error('❌ Failed to load cart:', response.error);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addItem = useCallback(async (item: Omit<CartItem, 'quantity'>) => {
    console.log('🛒 Adding product to cart:', {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });

    if (!isAuthenticated) {
      console.log('❌ User not authenticated, cannot add to cart');
      toast.error('Please login to add items to cart');
      return;
    }

    // Optimistic update
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        console.log('📦 Product already in cart, increasing quantity:', {
          productId: item.id,
          currentQuantity: existing.quantity,
          newQuantity: existing.quantity + 1,
        });
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      console.log('✨ Adding new product to cart');
      return [...prev, { ...item, quantity: 1 }];
    });

    try {
      const response = await cartService.addToCart({
        productId: item.id,
        quantity: 1,
      });

      if (response.success) {
        console.log('✅ Product successfully added to cart (backend confirmed)');
        toast.success('Added to cart');
        // Reload cart to get accurate data from backend
        await loadCart();
      } else {
        throw new Error(response.error?.message || 'Failed to add to cart');
      }
    } catch (error: any) {
      console.error('❌ Failed to add product to cart:', error);
      // Revert optimistic update
      setItems(prev => prev.filter(i => i.id !== item.id));
      toast.error(error.message || 'Failed to add to cart');
    }
  }, [isAuthenticated, loadCart]);

  const removeItem = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      return;
    }

    // Find the cart item ID from backend
    const response = await cartService.getCart();
    if (!response.success || !response.data) return;

    const cartItem = response.data.cart.items?.find((item: any) => item.product?.id === id);
    if (!cartItem) return;

    // Optimistic update with functional state update to capture previous state
    let previousItems: CartItem[] = [];
    setItems(prev => {
      previousItems = [...prev];
      return prev.filter(item => item.id !== id);
    });

    try {
      const deleteResponse = await cartService.removeFromCart(cartItem.id);

      if (deleteResponse.success) {
        toast.success('Removed from cart');
      } else {
        throw new Error(deleteResponse.error?.message || 'Failed to remove item');
      }
    } catch (error: any) {
      // Revert optimistic update
      setItems(previousItems);
      toast.error(error.message || 'Failed to remove item');
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (!isAuthenticated) {
      return;
    }

    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    // Find the cart item ID from backend
    const response = await cartService.getCart();
    if (!response.success || !response.data) return;

    const cartItem = response.data.cart.items?.find((item: any) => item.product?.id === id);
    if (!cartItem) return;

    // Optimistic update with functional state update to capture previous state
    let previousItems: CartItem[] = [];
    setItems(prev => {
      previousItems = [...prev];
      return prev.map(item => (item.id === id ? { ...item, quantity } : item));
    });

    try {
      const updateResponse = await cartService.updateCartItem(cartItem.id, { quantity });

      if (!updateResponse.success) {
        throw new Error(updateResponse.error?.message || 'Failed to update quantity');
      }
    } catch (error: any) {
      // Revert optimistic update
      setItems(previousItems);
      toast.error(error.message || 'Failed to update quantity');
    }
  }, [isAuthenticated, removeItem]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    // Optimistic update with functional state update to capture previous state
    let previousItems: CartItem[] = [];
    setItems(prev => {
      previousItems = [...prev];
      return [];
    });

    try {
      const response = await cartService.clearCart();

      if (response.success) {
        toast.success('Cart cleared');
      } else {
        throw new Error(response.error?.message || 'Failed to clear cart');
      }
    } catch (error: any) {
      // Revert optimistic update
      setItems(previousItems);
      toast.error(error.message || 'Failed to clear cart');
    }
  }, [isAuthenticated]);

  // Load cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setItems([]);
    }
  }, [isAuthenticated, loadCart]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
