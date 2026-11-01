import { supabase } from '../lib/supabase';
import { Shop, Product, Order } from '../types';

/**
 * SQL Schema query that the user can run in Supabase SQL Editor
 * to provision the NearKart tables.
 */
export const SUPABASE_SCHEMA_SQL = `-- NearKart Database Schema for Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/kdnyqvhmjourunluxwdn/sql

-- 1. Shops Table
CREATE TABLE IF NOT EXISTS public.shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  photo TEXT,
  rating NUMERIC DEFAULT 4.8,
  reviews_count INT DEFAULT 42,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  stock INT NOT NULL DEFAULT 10,
  unit TEXT DEFAULT 'unit',
  category TEXT NOT NULL,
  image TEXT,
  description TEXT,
  status TEXT DEFAULT 'In Stock',
  rating NUMERIC DEFAULT 4.7,
  shop_id TEXT REFERENCES public.shops(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  delivery_type TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  delivery_charge NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  status_timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public read/write policy for NearKart
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public shops access" ON public.shops;
CREATE POLICY "Public shops access" ON public.shops FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public products access" ON public.products;
CREATE POLICY "Public products access" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public orders access" ON public.orders;
CREATE POLICY "Public orders access" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public profiles access" ON public.profiles;
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Helpful Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON public.products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Enable Supabase Realtime for Orders table (alerts sellers instantly)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;
`;

export const supabaseService = {
  /**
   * Save or update shop in Supabase
   */
  async saveShop(shop: Shop): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('shops')
        .upsert({
          id: shop.id,
          name: shop.name,
          owner_name: shop.ownerName,
          phone: shop.phone,
          email: shop.email,
          address: shop.address,
          category: shop.category,
          photo: shop.photo,
          rating: shop.rating,
          reviews_count: shop.reviewCount,
        });

      if (error) {
        console.warn('Supabase shops table sync notice:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  },

  /**
   * Save a product to Supabase
   */
  async saveProduct(product: Product, shopId = 'shop_1'): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          name: product.name,
          price: product.price,
          original_price: product.originalPrice,
          stock: product.stock,
          unit: product.unit,
          category: product.category,
          image: product.image,
          description: product.description,
          status: product.status,
          shop_id: shopId,
        });

      if (error) {
        console.warn('Supabase products sync notice:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  },

  /**
   * Broadcast a new order event over Supabase Realtime channel
   */
  async broadcastNewOrder(order: Order): Promise<void> {
    try {
      const channel = supabase.channel('nearkart-orders');
      await channel.send({
        type: 'broadcast',
        event: 'new_order',
        payload: { order },
      });
    } catch (err) {
      console.debug('Supabase realtime broadcast notice:', err);
    }
  },

  /**
   * Subscribe to incoming orders via Supabase Realtime.
   * Listens to both Postgres INSERT changes and Realtime Broadcast messages.
   * Returns an unsubscribe function.
   */
  subscribeToOrderNotifications(
    onNewOrder: (order: Order) => void,
    onStatusChange?: (status: string) => void
  ): () => void {
    const channelName = 'nearkart-orders';
    const channel = supabase.channel(channelName);

    // 1. Listen for database INSERT changes on 'orders' table
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
      },
      (payload) => {
        try {
          const row = payload.new as Record<string, unknown>;
          if (!row || !row.id) return;

          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const newOrder: Order = {
            id: String(row.id),
            customerName: String(row.customer_name || 'Customer'),
            customerPhone: String(row.customer_phone || ''),
            customerAddress: String(row.customer_address || ''),
            deliveryType: (row.delivery_type as 'Home Delivery' | 'Store Pickup') || 'Home Delivery',
            items: (row.items as Order['items']) || [],
            subtotal: Number(row.subtotal) || 0,
            deliveryCharge: Number(row.delivery_charge) || 0,
            totalAmount: Number(row.total_amount) || 0,
            status: (row.status as Order['status']) || 'new',
            createdAt: `Today, ${timeStr}`,
            timeAgo: 'Just now',
            estimatedDelivery: `Today • ${timeStr} - 45 mins`,
            paymentMethod: (row.payment_method as Order['paymentMethod']) || 'Cash on Delivery',
            paymentStatus: (row.payment_status as Order['paymentStatus']) || 'Pending',
            statusTimeline: (row.status_timeline as Order['statusTimeline']) || [
              {
                status: 'new',
                label: 'Order Placed',
                timestamp: `Today, ${timeStr}`,
                note: 'Order submitted via NearKart Realtime',
                isCompleted: true,
                isCurrent: true,
              },
            ],
          };

          onNewOrder(newOrder);
        } catch (e) {
          console.debug('Error formatting real-time postgres order:', e);
        }
      }
    );

    // 2. Listen for Realtime Broadcast event 'new_order' (instant cross-tab/device sync)
    channel.on(
      'broadcast',
      { event: 'new_order' },
      (message) => {
        if (message.payload?.order) {
          onNewOrder(message.payload.order as Order);
        }
      }
    );

    // 3. Track subscription status
    channel.subscribe((status) => {
      if (onStatusChange) {
        onStatusChange(status);
      }
    });

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Save an order to Supabase & broadcast in realtime
   */
  async saveOrder(order: Order): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Realtime Broadcast immediately
      this.broadcastNewOrder(order);

      // 2. Persist to Postgres database
      const { error } = await supabase
        .from('orders')
        .upsert({
          id: order.id,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          customer_address: order.customerAddress,
          delivery_type: order.deliveryType,
          items: order.items,
          subtotal: order.subtotal,
          delivery_charge: order.deliveryCharge,
          total_amount: order.totalAmount,
          status: order.status,
          payment_method: order.paymentMethod,
          payment_status: order.paymentStatus,
          status_timeline: order.statusTimeline,
        });

      if (error) {
        console.warn('Supabase orders sync notice:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  },

  /**
   * Save user/buyer profile to Supabase
   */
  async saveProfile(profile: { name: string; phone: string; location: string; role: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            name: profile.name,
            phone: profile.phone,
            location: profile.location,
            role: profile.role,
          },
          { onConflict: 'phone' }
        );

      if (error) {
        console.warn('Supabase profile sync notice:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  },
};

