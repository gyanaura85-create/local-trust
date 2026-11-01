export type UserRole = 'seller' | 'buyer';

export type AppScreen = 
  | 'splash'
  | 'login'
  | 'otp'
  | 'role_select'
  | 'seller_register'
  | 'buyer_profile'
  // Seller screens
  | 'seller_dashboard'
  | 'seller_orders'
  | 'seller_order_details'
  | 'seller_products'
  | 'seller_add_product'
  | 'seller_create_ad'
  | 'seller_more'
  | 'seller_more_subscreen'
  // Buyer screens
  | 'buyer_home'
  | 'buyer_categories'
  | 'buyer_shop_view'
  | 'buyer_cart'
  | 'buyer_orders'
  | 'buyer_track_order'
  | 'buyer_profile_view';

export type SellerMoreSubscreenType =
  | 'manage_shop'
  | 'business_hours'
  | 'delivery_pickup'
  | 'payment_bank'
  | 'categories'
  | 'inventory'
  | 'deals_offers'
  | 'sales_report'
  | 'reviews'
  | 'language'
  | 'support'
  | 'notifications';

export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'rejected';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface StatusTimelineStep {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string; // e.g. '#NK1254'
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryType: 'Home Delivery' | 'Store Pickup';
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  timeAgo: string;
  estimatedDelivery: string;
  sellerNotes?: string;
  paymentMethod: 'Stripe Card' | 'Cash on Delivery' | 'UPI';
  paymentStatus: 'Paid' | 'Pending';
  statusTimeline: StatusTimelineStep[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  description: string;
  offer?: string;
  expiryDate?: string;
  unit?: string;
}

export interface Shop {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email?: string;
  address: string;
  category: string;
  photo: string;
  isOpen: boolean;
  closingTime: string;
  rating: number;
  reviewCount: number;
  distance: string;
  description?: string;
  deliveryZones: string[];
  minimumOrder: number;
  deliveryFee: number;
  bankDetails: {
    accountHolder: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId: string;
    stripeConnected: boolean;
    stripeAccountId?: string;
  };
}

export interface ShopAd {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  status: 'Published' | 'Draft' | 'Under Review';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  shopId: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
}
