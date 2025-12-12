import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import * as wishlistService from '@/services/wishlistService';
import { toast } from 'sonner';
import type { WishlistItem } from '@/types';

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      // Clear wishlist when user logs out
      setItems([]);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();

      if (response.success && response.data) {
        setItems(response.data.items || []);
      } else {
        console.error('Failed to load wishlist:', response.error);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.productId === productId);
  };

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    // Optimistic update
    const optimisticItem: WishlistItem = {
      id: 'temp-' + productId,
      productId,
      product: {
        id: productId,
        category: '',
        price: 0,
        name: '',
        description: '',
        imageUrl: '',
        inStock: true
      },
      addedAt: new Date().toISOString()
    };

    setItems(prev => [...prev, optimisticItem]);

    try {
      const response = await wishlistService.addToWishlist(productId);

      if (response.success) {
        toast.success('Added to wishlist');
        // Reload wishlist to get accurate data from backend
        await loadWishlist();
      } else {
        throw new Error(response.error?.message || 'Failed to add to wishlist');
      }
    } catch (error: any) {
      console.error('Failed to add to wishlist:', error);
      // Revert optimistic update
      setItems(prev => prev.filter(item => item.id !== optimisticItem.id));

      // Don't show error if item is already in wishlist
      if (error.message !== 'Product is already in wishlist') {
        toast.error(error.message || 'Failed to add to wishlist');
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      return;
    }

    // Optimistic update
    const previousItems = [...items];
    setItems(prev => prev.filter(item => item.productId !== productId));

    try {
      const response = await wishlistService.removeFromWishlist(productId);

      if (response.success) {
        toast.success('Removed from wishlist');
      } else {
        throw new Error(response.error?.message || 'Failed to remove from wishlist');
      }
    } catch (error: any) {
      // Revert optimistic update
      setItems(previousItems);
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
