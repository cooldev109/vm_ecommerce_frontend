/**
 * Shared TypeScript types for the application
 */

// User & Authentication
export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  customerType: 'INDIVIDUAL' | 'BUSINESS';
  taxId: string | null;
  businessName: string | null;
  businessTaxId: string | null;
  preferredLanguage: 'ES' | 'EN' | 'FR' | 'DE' | 'PT' | 'ZH' | 'HI';
}

export interface Address {
  id: string;
  type: 'SHIPPING' | 'BILLING';
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Products
export interface Product {
  id: string;
  category: 'CANDLES' | 'ACCESSORIES' | 'SETS';
  price: string;
  image: string;
  images: string[];
  inStock: boolean;
  burnTime: string | null;
  size: string | null;
  featured: boolean;
  translations: ProductTranslation[];
}

export interface ProductTranslation {
  language: 'ES' | 'EN' | 'FR' | 'DE' | 'PT' | 'ZH' | 'HI';
  name: string;
  description: string;
  longDescription: string | null;
  features: string[];
}

// Cart
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: string;
  image: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// Orders
export interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  total: string;
  subtotal: string;
  shippingCost: string;
  items: OrderItem[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  shippingStreet: string;
  shippingCity: string;
  shippingRegion: string;
  shippingPostalCode: string;
  shippingCountry: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  invoice?: Invoice;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  priceAtOrder: string;
  quantity: number;
  image: string;
  product?: {
    id: string;
    images?: string[];
  };
}

// Invoices
export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: string;
  subtotal: string;
  taxAmount: string;
  shippingCost: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
  pdfUrl: string | null;
}

// Payments
export interface PaymentIntent {
  token: string;
  url: string;
  orderId: string;
}

export interface PaymentStatus {
  orderId: string;
  orderStatus: string;
  paymentStatus: string;
  total: number;
  hasWebpayToken: boolean;
  transactionId: string | null;
}

// Reviews
export interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

// Wishlist
export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    category: string;
    price: number;
    name: string;
    description: string;
    imageUrl: string;
    inStock: boolean;
  };
  addedAt: string;
}
