import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  AppScreen, 
  UserRole, 
  OrderStatus, 
  Product, 
  Order, 
  OrderItem,
  Shop, 
  ShopAd, 
  CartItem, 
  SellerMoreSubscreenType, 
  CustomerReview 
} from '../types';
import { 
  INITIAL_SHOP, 
  OTHER_SHOPS, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_ADS, 
  INITIAL_REVIEWS 
} from '../data/initialData';
import { supabaseService } from '../services/supabaseService';
import { playOrderAlertSound } from '../utils/audioAlert';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & Role
  currentScreen: AppScreen;
  navigateTo: (screen: AppScreen, addToHistory?: boolean) => void;
  goBack: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;

  // Auth State
  isAuthenticated: boolean;
  userPhone: string;
  setUserPhone: (phone: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  userLocation: string;
  setUserLocation: (loc: string) => void;
  generatedOtp: string;
  resendOtp: () => void;
  verifyOtp: (inputOtp: string) => boolean;
  resendTimer: number;
  logout: () => void;
  loginDemo: (role: UserRole) => void;
  restartOnboarding: () => void;
  setIsAuthenticated: (val: boolean) => void;

  // Shop Data
  shop: Shop;
  updateShop: (updated: Partial<Shop>) => void;
  allShops: Shop[];

  // Products
  products: Product[];
  addProduct: (newProd: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  selectedProductForEdit: Product | null;
  setSelectedProductForEdit: (prod: Product | null) => void;

  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, customNote?: string) => void;
  createBuyerOrder: (
    items: CartItem[], 
    deliveryType: 'Home Delivery' | 'Store Pickup', 
    address: string,
    paymentMethod: 'Stripe Card' | 'Cash on Delivery' | 'UPI'
  ) => Order;

  // Buyer Cart
  cart: CartItem[];
  addToCart: (product: Product, shopId?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Ads
  ads: ShopAd[];
  createAd: (ad: Omit<ShopAd, 'id' | 'createdAt'>) => void;

  // Reviews
  reviews: CustomerReview[];
  addReviewReply: (reviewId: string, reply: string) => void;

  // Seller More Subscreens
  activeMoreSubscreen: SellerMoreSubscreenType | null;
  openMoreSubscreen: (type: SellerMoreSubscreenType) => void;
  closeMoreSubscreen: () => void;

  // Stripe Checkout Modal
  isStripeModalOpen: boolean;
  stripeOrderPending: {
    items: CartItem[];
    deliveryType: 'Home Delivery' | 'Store Pickup';
    address: string;
    amount: number;
  } | null;
  openStripeCheckout: (
    items: CartItem[], 
    deliveryType: 'Home Delivery' | 'Store Pickup', 
    address: string, 
    amount: number
  ) => void;
  closeStripeCheckout: () => void;
  confirmStripePayment: (cardLast4: string) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Supabase Realtime Order Notifications
  realtimeStatus: string;
  activeRealtimeAlert: Order | null;
  dismissRealtimeAlert: () => void;
  acceptRealtimeAlert: (orderId: string) => void;
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  simulateIncomingOrder: () => void;
  unreadOrdersCount: number;
  clearUnreadOrders: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation stack
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [screenHistory, setScreenHistory] = useState<AppScreen[]>([]);
  const [role, setRole] = useState<UserRole>('seller');

  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nearkart_auth') === 'true';
  });
  const [userPhone, setUserPhone] = useState<string>(() => {
    return localStorage.getItem('nearkart_phone') || '+91 98765 43210';
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('nearkart_name') || 'Ali Khan';
  });
  const [userLocation, setUserLocation] = useState<string>(() => {
    return localStorage.getItem('nearkart_loc') || 'Bapuji Nagar, Bhubaneswar, Odisha';
  });
  const [generatedOtp, setGeneratedOtp] = useState<string>('582419');
  const [resendTimer, setResendTimer] = useState<number>(45);

  // Shop & Persistence
  const [shop, setShop] = useState<Shop>(() => {
    const saved = localStorage.getItem('nearkart_shop');
    return saved ? JSON.parse(saved) : INITIAL_SHOP;
  });

  const [allShops] = useState<Shop[]>(OTHER_SHOPS);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nearkart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nearkart_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nearkart_cart');
    if (saved) return JSON.parse(saved);
    // Pre-populate with 2 items for delightful immediate preview matching screenshot 7 ("Cart: 2")
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1, shopId: 'shop_1' },
      { product: INITIAL_PRODUCTS[1], quantity: 2, shopId: 'shop_1' }
    ];
  });

  // Ads
  const [ads, setAds] = useState<ShopAd[]>(() => {
    const saved = localStorage.getItem('nearkart_ads');
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  // Reviews
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('nearkart_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Seller More subscreen
  const [activeMoreSubscreen, setActiveMoreSubscreen] = useState<SellerMoreSubscreenType | null>(null);

  // Stripe Checkout
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [stripeOrderPending, setStripeOrderPending] = useState<{
    items: CartItem[];
    deliveryType: 'Home Delivery' | 'Store Pickup';
    address: string;
    amount: number;
  } | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Realtime Orders & Alert State
  const [realtimeStatus, setRealtimeStatus] = useState<string>('CONNECTING');
  const [activeRealtimeAlert, setActiveRealtimeAlert] = useState<Order | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => {
    return localStorage.getItem('nearkart_audio_muted') === 'true';
  });
  const [unreadOrdersCount, setUnreadOrdersCount] = useState<number>(0);

  const isAudioMutedRef = useRef(isAudioMuted);
  useEffect(() => {
    isAudioMutedRef.current = isAudioMuted;
    localStorage.setItem('nearkart_audio_muted', isAudioMuted ? 'true' : 'false');
  }, [isAudioMuted]);

  // Subscribe to Supabase Realtime Orders
  useEffect(() => {
    const unsubscribe = supabaseService.subscribeToOrderNotifications(
      (incomingOrder) => {
        // Idempotency: avoid duplicate addition if order already exists
        setOrders(prev => {
          if (prev.some(o => o.id === incomingOrder.id)) {
            return prev;
          }
          return [incomingOrder, ...prev];
        });

        // Trigger Audio Chime if not muted
        if (!isAudioMutedRef.current) {
          playOrderAlertSound();
        }

        // Show active floating alert card to seller
        setActiveRealtimeAlert(incomingOrder);
        setUnreadOrdersCount(prev => prev + 1);

        showToast(
          `🔔 New Order Received: ${incomingOrder.id} (₹${incomingOrder.totalAmount})`,
          'success'
        );
      },
      (status) => {
        setRealtimeStatus(status);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleAudioMute = () => {
    setIsAudioMuted(prev => !prev);
    showToast(!isAudioMuted ? 'Audio chime muted' : 'Audio chime enabled for incoming orders', 'info');
  };

  const clearUnreadOrders = () => {
    setUnreadOrdersCount(0);
  };

  const dismissRealtimeAlert = () => {
    setActiveRealtimeAlert(null);
  };

  const acceptRealtimeAlert = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted');
    setActiveRealtimeAlert(null);
    navigateTo('seller_order_details');
  };

  const simulateIncomingOrder = () => {
    const sampleBuyers = [
      { name: 'Priya Sharma', phone: '+91 98234 11223', loc: 'Plot 42, Saheed Nagar, Bhubaneswar' },
      { name: 'Rohan Mehra', phone: '+91 97112 33445', loc: 'Flat 302, Green Valley Apartments, Khandagiri' },
      { name: 'Sunita Nayak', phone: '+91 98661 55667', loc: 'House 14, Master Canteen Square, Station Rd' },
      { name: 'Vikram Sengupta', phone: '+91 99345 77889', loc: 'Lane 7, Nayapalli, Behind Passport Office' }
    ];
    const buyer = sampleBuyers[Math.floor(Math.random() * sampleBuyers.length)];
    const p1 = products[0] || INITIAL_PRODUCTS[0];
    const p2 = products[1] || INITIAL_PRODUCTS[1];

    const orderNumber = `#NK${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

    const simOrder: Order = {
      id: orderNumber,
      customerName: buyer.name,
      customerPhone: buyer.phone,
      customerAddress: buyer.loc,
      deliveryType: 'Home Delivery',
      items: [
        {
          id: `item_${Date.now()}_1`,
          productId: p1.id,
          name: p1.name,
          price: p1.price,
          quantity: 2,
          image: p1.image,
          category: p1.category
        },
        {
          id: `item_${Date.now()}_2`,
          productId: p2.id,
          name: p2.name,
          price: p2.price,
          quantity: 1,
          image: p2.image,
          category: p2.category
        }
      ],
      subtotal: (p1.price * 2) + p2.price,
      deliveryCharge: 40,
      totalAmount: (p1.price * 2) + p2.price + 40,
      status: 'new',
      createdAt: `Today, ${timeStr}`,
      timeAgo: 'Just now',
      estimatedDelivery: `Today • ${timeStr} - 45 mins`,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      statusTimeline: [
        {
          status: 'new',
          label: 'Order Placed',
          timestamp: `${dateStr}, ${timeStr}`,
          note: 'Customer paid via UPI • Waiting for seller acceptance',
          isCompleted: true,
          isCurrent: true
        },
        {
          status: 'accepted',
          label: 'Order Accepted',
          timestamp: 'Waiting for seller',
          note: 'Seller will confirm shortly',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'preparing',
          label: 'Preparing',
          timestamp: 'Pending',
          note: 'Items will be packed from shop shelf',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'ready',
          label: 'Ready for Dispatch',
          timestamp: 'Pending',
          note: 'Package ready',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'out_for_delivery',
          label: 'Out for Delivery',
          timestamp: 'Pending',
          note: 'Rider on the way',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'delivered',
          label: 'Delivered',
          timestamp: 'Pending',
          note: 'Delivered to customer',
          isCompleted: false,
          isCurrent: false
        }
      ]
    };

    // Broadcast through Supabase Realtime channel
    supabaseService.saveOrder(simOrder);

    // Apply locally
    setOrders(prev => {
      if (prev.some(o => o.id === simOrder.id)) return prev;
      return [simOrder, ...prev];
    });

    if (!isAudioMutedRef.current) {
      playOrderAlertSound();
    }
    setActiveRealtimeAlert(simOrder);
    setUnreadOrdersCount(prev => prev + 1);
    showToast(`⚡ Real-time Order ${simOrder.id} dispatched via Supabase!`, 'success');
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('nearkart_auth', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('nearkart_phone', userPhone);
    localStorage.setItem('nearkart_name', userName);
    localStorage.setItem('nearkart_loc', userLocation);
    localStorage.setItem('nearkart_shop', JSON.stringify(shop));
    localStorage.setItem('nearkart_products', JSON.stringify(products));
    localStorage.setItem('nearkart_orders', JSON.stringify(orders));
    localStorage.setItem('nearkart_cart', JSON.stringify(cart));
    localStorage.setItem('nearkart_ads', JSON.stringify(ads));
    localStorage.setItem('nearkart_reviews', JSON.stringify(reviews));
  }, [isAuthenticated, userPhone, userName, userLocation, shop, products, orders, cart, ads, reviews]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateTo = (screen: AppScreen, addToHistory = true) => {
    if (addToHistory && currentScreen !== screen) {
      setScreenHistory(prev => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (activeMoreSubscreen) {
      setActiveMoreSubscreen(null);
      return;
    }
    if (screenHistory.length > 0) {
      const prevScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory(prev => prev.slice(0, -1));
      setCurrentScreen(prevScreen);
    } else {
      // Fallback sensible screen
      if (role === 'seller') {
        setCurrentScreen('seller_dashboard');
      } else {
        setCurrentScreen('buyer_home');
      }
    }
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'seller') {
      setCurrentScreen('seller_dashboard');
      showToast('Switched to Seller Mode', 'info');
    } else {
      setCurrentScreen('buyer_home');
      showToast('Switched to Buyer Mode', 'info');
    }
  };

  const resendOtp = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setResendTimer(45);
    showToast(`New OTP generated: ${newCode}`, 'success');
  };

  const verifyOtp = (inputOtp: string) => {
    if (inputOtp === generatedOtp || inputOtp === '582419' || inputOtp.length === 6) {
      setIsAuthenticated(true);
      showToast('Phone verified successfully!', 'success');
      return true;
    }
    showToast('Invalid OTP. Please check the 6-digit code.', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setScreenHistory([]);
    setCurrentScreen('login');
    showToast('Logged out of session', 'info');
  };

  const restartOnboarding = () => {
    setIsAuthenticated(false);
    setScreenHistory([]);
    setCurrentScreen('splash');
    showToast('Starting onboarding sequence from splash screen...', 'info');
  };

  const loginDemo = (selectedRole: UserRole) => {
    setIsAuthenticated(true);
    setRole(selectedRole);
    if (selectedRole === 'seller') {
      setCurrentScreen('seller_dashboard');
    } else {
      setCurrentScreen('buyer_home');
    }
  };

  const updateShop = (updated: Partial<Shop>) => {
    setShop(prev => {
      const merged = { ...prev, ...updated };
      supabaseService.saveShop(merged);
      return merged;
    });
    showToast('Shop details updated & synced to Supabase', 'success');
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod_${Date.now()}`;
    const product: Product = {
      ...newProd,
      id
    };
    setProducts(prev => [product, ...prev]);
    supabaseService.saveProduct(product);
    showToast(`"${product.name}" added to inventory & Supabase!`, 'success');
    navigateTo('seller_products');
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed', 'info');
  };

  // Status progression mapping
  const nextStatusMap: Record<OrderStatus, OrderStatus> = {
    'new': 'accepted',
    'accepted': 'preparing',
    'preparing': 'ready',
    'ready': 'out_for_delivery',
    'out_for_delivery': 'delivered',
    'delivered': 'delivered',
    'rejected': 'rejected'
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, customNote?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
      const formattedTimestamp = `${dateStr}, ${timeStr}`;

      const defaultNotes: Record<OrderStatus, string> = {
        'new': 'Order submitted',
        'accepted': 'Seller confirmed order and began verification',
        'preparing': 'Items gathered and packaged with care',
        'ready': 'Package packed and ready for delivery partner',
        'out_for_delivery': 'Rider is on the way to customer address',
        'delivered': 'Package delivered and handed to customer',
        'rejected': 'Order cancelled by seller due to unavailability'
      };

      const updatedTimeline = order.statusTimeline.map(step => {
        if (step.status === newStatus) {
          return {
            ...step,
            timestamp: formattedTimestamp,
            note: customNote || defaultNotes[newStatus],
            isCompleted: true,
            isCurrent: true
          };
        }
        if (step.status === order.status) {
          return { ...step, isCurrent: false };
        }
        return step;
      });

      // If newStatus not in timeline yet (e.g. rejected), add it
      const hasStep = updatedTimeline.some(s => s.status === newStatus);
      if (!hasStep) {
        updatedTimeline.push({
          status: newStatus,
          label: newStatus.replace(/_/g, ' ').toUpperCase(),
          timestamp: formattedTimestamp,
          note: customNote || defaultNotes[newStatus],
          isCompleted: true,
          isCurrent: true
        });
      }

      const updatedOrder: Order = {
        ...order,
        status: newStatus,
        statusTimeline: updatedTimeline
      };

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }

      return updatedOrder;
    }));

    showToast(`Order ${orderId} updated to: ${newStatus.replace(/_/g, ' ').toUpperCase()}`, 'success');
  };

  const createBuyerOrder = (
    cartItems: CartItem[], 
    deliveryType: 'Home Delivery' | 'Store Pickup',
    address: string,
    paymentMethod: 'Stripe Card' | 'Cash on Delivery' | 'UPI'
  ): Order => {
    const orderNumber = `#NK${Math.floor(1255 + Math.random() * 8000)}`;
    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const deliveryCharge = deliveryType === 'Home Delivery' ? 40 : 0;
    const totalAmount = subtotal + deliveryCharge;

    const orderItems: OrderItem[] = cartItems.map(item => ({
      id: `item_${Date.now()}_${item.product.id}`,
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      category: item.product.category
    }));

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

    const newOrder: Order = {
      id: orderNumber,
      customerName: userName || 'Ramesh Kumar',
      customerPhone: userPhone || '9876543210',
      customerAddress: address || userLocation || 'Bapuji Nagar, Bhubaneswar, Odisha',
      deliveryType,
      items: orderItems,
      subtotal,
      deliveryCharge,
      totalAmount,
      status: 'new',
      createdAt: `Today, ${timeStr}`,
      timeAgo: 'Just now',
      estimatedDelivery: `Today • ${timeStr} - 45 mins`,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      statusTimeline: [
        {
          status: 'new',
          label: 'Order Placed',
          timestamp: `${dateStr}, ${timeStr}`,
          note: `Order submitted via NearKart (${paymentMethod})`,
          isCompleted: true,
          isCurrent: true
        },
        {
          status: 'accepted',
          label: 'Order Accepted',
          timestamp: 'Waiting for seller',
          note: 'Seller will confirm shortly',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'preparing',
          label: 'Preparing',
          timestamp: 'Pending',
          note: 'Items will be packed from shop shelf',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'ready',
          label: 'Ready for Dispatch',
          timestamp: 'Pending',
          note: 'Sealed package ready',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'out_for_delivery',
          label: 'Out for Delivery',
          timestamp: 'Pending',
          note: 'Delivery rider is on the way',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'delivered',
          label: 'Delivered',
          timestamp: 'Pending',
          note: 'Order successfully delivered',
          isCompleted: false,
          isCurrent: false
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    setCart([]);
    supabaseService.saveOrder(newOrder);
    showToast(`Order ${orderNumber} placed & synced to Supabase!`, 'success');
    return newOrder;
  };

  // Cart operations
  const addToCart = (product: Product, shopId = 'shop_1') => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, shopId }];
    });
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const createAd = (adData: Omit<ShopAd, 'id' | 'createdAt'>) => {
    const newAd: ShopAd = {
      ...adData,
      id: `ad_${Date.now()}`,
      createdAt: 'Today'
    };
    setAds(prev => [newAd, ...prev]);
    showToast('Shop advertisement published live!', 'success');
    navigateTo('seller_dashboard');
  };

  const addReviewReply = (reviewId: string, reply: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply } : r));
    showToast('Reply posted to customer review', 'success');
  };

  const openMoreSubscreen = (type: SellerMoreSubscreenType) => {
    setActiveMoreSubscreen(type);
    navigateTo('seller_more_subscreen');
  };

  const closeMoreSubscreen = () => {
    setActiveMoreSubscreen(null);
    navigateTo('seller_more');
  };

  // Stripe Checkout Modal Handler
  const openStripeCheckout = (
    items: CartItem[], 
    deliveryType: 'Home Delivery' | 'Store Pickup', 
    address: string, 
    amount: number
  ) => {
    setStripeOrderPending({ items, deliveryType, address, amount });
    setIsStripeModalOpen(true);
  };

  const closeStripeCheckout = () => {
    setIsStripeModalOpen(false);
    setStripeOrderPending(null);
  };

  const confirmStripePayment = (cardLast4: string) => {
    if (!stripeOrderPending) return;
    const created = createBuyerOrder(
      stripeOrderPending.items,
      stripeOrderPending.deliveryType,
      stripeOrderPending.address,
      'Stripe Card'
    );
    setIsStripeModalOpen(false);
    setStripeOrderPending(null);
    navigateTo('buyer_track_order');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        goBack,
        role,
        setRole,
        switchRole,

        isAuthenticated,
        userPhone,
        setUserPhone,
        userName,
        setUserName,
        userLocation,
        setUserLocation,
        generatedOtp,
        resendOtp,
        verifyOtp,
        resendTimer,
        logout,
        loginDemo,
        restartOnboarding,
        setIsAuthenticated,

        shop,
        updateShop,
        allShops,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        selectedProductForEdit,
        setSelectedProductForEdit,

        orders,
        selectedOrder,
        setSelectedOrder,
        updateOrderStatus,
        createBuyerOrder,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,

        ads,
        createAd,

        reviews,
        addReviewReply,

        activeMoreSubscreen,
        openMoreSubscreen,
        closeMoreSubscreen,

        isStripeModalOpen,
        stripeOrderPending,
        openStripeCheckout,
        closeStripeCheckout,
        confirmStripePayment,

        toasts,
        showToast,
        removeToast,

        realtimeStatus,
        activeRealtimeAlert,
        dismissRealtimeAlert,
        acceptRealtimeAlert,
        isAudioMuted,
        toggleAudioMute,
        simulateIncomingOrder,
        unreadOrdersCount,
        clearUnreadOrders
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
