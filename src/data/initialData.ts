import { Product, Shop, Order, ShopAd, CustomerReview } from '../types';

export const INITIAL_SHOP: Shop = {
  id: 'shop_1',
  name: 'Sharma General Store',
  ownerName: 'Ali Khan',
  phone: '+91 98765 43210',
  email: 'sharmageneral@nearkart.com',
  address: 'Bapuji Nagar, Main Market, Bhubaneswar, Odisha 751009',
  category: 'Grocery & Daily Essentials',
  photo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
  isOpen: true,
  closingTime: '10:00 PM',
  rating: 4.8,
  reviewCount: 142,
  distance: '0.4 km',
  description: 'Your reliable neighbourhood grocery store delivering farm-fresh essentials, staples, dairy, and household goods within 30 minutes.',
  deliveryZones: ['Bapuji Nagar', 'Saheed Nagar', 'Ashok Nagar', 'Patia', 'Khandagiri'],
  minimumOrder: 99,
  deliveryFee: 30,
  bankDetails: {
    accountHolder: 'Sharma General Store',
    accountNumber: '•••• •••• 8492',
    ifscCode: 'SBIN0004128',
    bankName: 'State Bank of India',
    upiId: 'sharma.store@oksbi',
    stripeConnected: true,
    stripeAccountId: 'acct_1NearKartSharma'
  }
};

export const OTHER_SHOPS: Shop[] = [
  INITIAL_SHOP,
  {
    id: 'shop_2',
    name: 'Fashion Hub',
    ownerName: 'Vikram Seth',
    phone: '+91 98111 22334',
    email: 'fashionhub@nearkart.com',
    address: 'Plot 42, Janpath Road, Bhubaneswar, Odisha',
    category: 'Fashion & Clothing',
    photo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=80',
    isOpen: true,
    closingTime: '9:30 PM',
    rating: 4.6,
    reviewCount: 98,
    distance: '2.5 km',
    description: 'Trendy casuals, ethnic wear, and modern footwear for men, women, and kids.',
    deliveryZones: ['Janpath', 'Saheed Nagar', 'Master Canteen'],
    minimumOrder: 299,
    deliveryFee: 40,
    bankDetails: {
      accountHolder: 'Fashion Hub Retail',
      accountNumber: '•••• •••• 3190',
      ifscCode: 'HDFC0001244',
      bankName: 'HDFC Bank',
      upiId: 'fashionhub@okhdfc',
      stripeConnected: true
    }
  },
  {
    id: 'shop_3',
    name: 'Daily Needs Supermarket',
    ownerName: 'Sunita Dash',
    phone: '+91 98450 99887',
    email: 'dailyneeds@nearkart.com',
    address: 'Near Big Bazaar, Patia Square, Bhubaneswar, Odisha',
    category: 'Grocery & Organic Food',
    photo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
    isOpen: true,
    closingTime: '11:00 PM',
    rating: 4.9,
    reviewCount: 220,
    distance: '3.1 km',
    description: 'Fresh organic vegetables, imported dry fruits, and everyday household supplies.',
    deliveryZones: ['Patia', 'KIIT Road', 'Infocity', 'Chandrasekharpur'],
    minimumOrder: 150,
    deliveryFee: 25,
    bankDetails: {
      accountHolder: 'Daily Needs Mart',
      accountNumber: '•••• •••• 7712',
      ifscCode: 'ICIC0000492',
      bankName: 'ICICI Bank',
      upiId: 'dailyneeds@okicici',
      stripeConnected: true
    }
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Aashirvaad Atta 5kg',
    category: 'Atta, Rice & Dal',
    price: 250.00,
    originalPrice: 280.00,
    stock: 45,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
    description: '100% pure whole wheat flour processed with traditional chakki grinding for fluffy, soft rotis.',
    offer: '10% OFF',
    unit: '5 kg pack'
  },
  {
    id: 'prod_2',
    name: 'Fortune Sunflower Oil 1L',
    category: 'Oil & Ghee',
    price: 135.00,
    originalPrice: 155.00,
    stock: 60,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80',
    description: 'Refined sunflower oil enriched with vitamins A & D, ideal for daily heart-healthy cooking.',
    offer: '₹20 OFF',
    unit: '1 Litre Pouch'
  },
  {
    id: 'prod_3',
    name: 'Tata Salt 1kg',
    category: 'Masala & Spices',
    price: 20.00,
    originalPrice: 24.00,
    stock: 120,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=300&auto=format&fit=crop&q=80',
    description: 'Desh Ka Namak. Vacuum evaporated iodized salt ensures optimal mental development and purity.',
    unit: '1 kg packet'
  },
  {
    id: 'prod_4',
    name: 'Red Label Tea 250g',
    category: 'Beverages',
    price: 95.00,
    originalPrice: 110.00,
    stock: 80,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=300&auto=format&fit=crop&q=80',
    description: 'Brooke Bond Red Label crafted with exceptional taste, invigorating aroma, and strength.',
    offer: 'Special Price',
    unit: '250 g pack'
  },
  {
    id: 'prod_5',
    name: 'Parle-G Biscuit 200g',
    category: 'Snacks & Biscuits',
    price: 20.00,
    originalPrice: 25.00,
    stock: 150,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&auto=format&fit=crop&q=80',
    description: 'The golden crunchy glucose biscuit cherished by millions across generations with morning chai.',
    unit: '200 g pack'
  },
  {
    id: 'prod_6',
    name: 'Clinic Plus Shampoo 340ml',
    category: 'Personal Care',
    price: 165.00,
    originalPrice: 190.00,
    stock: 35,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=80',
    description: 'Strong & Long Health Shampoo with milk protein formula for deeply nourished, resilient hair.',
    offer: '15% OFF',
    unit: '340 ml Bottle'
  },
  {
    id: 'prod_7',
    name: 'Surf Excel 1kg',
    category: 'Home Care',
    price: 175.00,
    originalPrice: 199.00,
    stock: 25,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=300&auto=format&fit=crop&q=80',
    description: 'Surf Excel Easy Wash powder delivers stain-free clean washes in tough collar and cuff areas.',
    unit: '1 kg pack'
  },
  {
    id: 'prod_8',
    name: 'Toor Dal 1kg',
    category: 'Atta, Rice & Dal',
    price: 110.00,
    originalPrice: 130.00,
    stock: 10,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80',
    description: 'Unpolished premium Arhar/Toor dal rich in natural protein, high fiber, and minerals.',
    unit: '1 kg pouch'
  },
  {
    id: 'prod_9',
    name: 'Maggi 2-Minute Noodles',
    category: 'Snacks & Biscuits',
    price: 14.00,
    originalPrice: 14.00,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80',
    description: 'Masala instant noodles with iconic spice blend, prepared in just 2 quick minutes.',
    unit: '70 g pack'
  },
  {
    id: 'prod_10',
    name: 'Nivea Body Lotion 400ml',
    category: 'Personal Care',
    price: 299.00,
    originalPrice: 375.00,
    stock: 15,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80',
    description: 'Nourishing body milk with deep moisture serum and almond oil for 48h intensive hydration.',
    offer: '20% OFF',
    unit: '400 ml pump bottle'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '#NK1254',
    customerName: 'Ramesh Kumar',
    customerPhone: '9876543210',
    customerAddress: 'Bapuji Nagar, Bhubaneswar, Odisha 751009',
    deliveryType: 'Home Delivery',
    items: [
      {
        id: 'item_1',
        productId: 'prod_1',
        name: 'Aashirvaad Atta 5kg',
        price: 250,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=80',
        category: 'Atta, Rice & Dal'
      },
      {
        id: 'item_2',
        productId: 'prod_2',
        name: 'Fortune Sunflower Oil 1L',
        price: 135,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&auto=format&fit=crop&q=80',
        category: 'Oil & Ghee'
      },
      {
        id: 'item_3',
        productId: 'prod_3',
        name: 'Tata Salt 1kg',
        price: 20,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=100&auto=format&fit=crop&q=80',
        category: 'Masala & Spices'
      },
      {
        id: 'item_4',
        productId: 'prod_4',
        name: 'Red Label Tea 250g',
        price: 95,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=100&auto=format&fit=crop&q=80',
        category: 'Beverages'
      },
      {
        id: 'item_5',
        productId: 'prod_5',
        name: 'Parle-G Biscuit 200g',
        price: 20,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&auto=format&fit=crop&q=80',
        category: 'Snacks & Biscuits'
      },
      {
        id: 'item_6',
        productId: 'prod_8',
        name: 'Toor Dal 1kg',
        price: 110,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop&q=80',
        category: 'Atta, Rice & Dal'
      }
    ],
    subtotal: 720,
    deliveryCharge: 65,
    totalAmount: 785,
    status: 'new',
    createdAt: 'Today, 10:30 AM',
    timeAgo: '20 min ago',
    estimatedDelivery: 'Today, 08 May • 6:00 PM - 8:00 PM',
    paymentMethod: 'Stripe Card',
    paymentStatus: 'Paid',
    statusTimeline: [
      {
        status: 'new',
        label: 'Order Placed',
        timestamp: '08 May 2025, 10:30 AM',
        note: 'Order submitted and payment verified via Stripe',
        isCompleted: true,
        isCurrent: true
      },
      {
        status: 'accepted',
        label: 'Order Accepted',
        timestamp: 'Pending confirmation',
        note: 'Seller will confirm availability',
        isCompleted: false,
        isCurrent: false
      },
      {
        status: 'preparing',
        label: 'Preparing',
        timestamp: 'Pending',
        note: 'Seller is packing items from shelf',
        isCompleted: false,
        isCurrent: false
      },
      {
        status: 'ready',
        label: 'Ready for Dispatch',
        timestamp: 'Pending',
        note: 'Bag packed and sealed with invoice',
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
        note: 'Order handed over successfully',
        isCompleted: false,
        isCurrent: false
      }
    ]
  },
  {
    id: '#NK1253',
    customerName: 'Anita Patnaik',
    customerPhone: '9123456780',
    customerAddress: 'Patia, Bhubaneswar, Odisha 751024',
    deliveryType: 'Home Delivery',
    items: [
      {
        id: 'item_10',
        productId: 'prod_6',
        name: 'Clinic Plus Shampoo 340ml',
        price: 165,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=100&auto=format&fit=crop&q=80'
      },
      {
        id: 'item_11',
        productId: 'prod_7',
        name: 'Surf Excel 1kg',
        price: 175,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=100&auto=format&fit=crop&q=80'
      },
      {
        id: 'item_12',
        productId: 'prod_4',
        name: 'Red Label Tea 250g',
        price: 95,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=100&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 435,
    deliveryCharge: 15,
    totalAmount: 450,
    status: 'new',
    createdAt: 'Today, 09:45 AM',
    timeAgo: '45 min ago',
    estimatedDelivery: 'Today, 08 May • 5:30 PM - 7:00 PM',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    statusTimeline: [
      {
        status: 'new',
        label: 'Order Placed',
        timestamp: '08 May 2025, 09:45 AM',
        note: 'Order submitted by customer',
        isCompleted: true,
        isCurrent: true
      },
      {
        status: 'accepted',
        label: 'Order Accepted',
        timestamp: 'Pending',
        note: 'Seller review',
        isCompleted: false,
        isCurrent: false
      }
    ]
  },
  {
    id: '#NK1252',
    customerName: 'Suresh Mohanty',
    customerPhone: '9090909090',
    customerAddress: 'Saheed Nagar, Bhubaneswar, Odisha 751007',
    deliveryType: 'Home Delivery',
    items: [
      {
        id: 'item_20',
        productId: 'prod_1',
        name: 'Aashirvaad Atta 5kg',
        price: 250,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=80'
      },
      {
        id: 'item_21',
        productId: 'prod_3',
        name: 'Tata Salt 1kg',
        price: 20,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=100&auto=format&fit=crop&q=80'
      },
      {
        id: 'item_22',
        productId: 'prod_8',
        name: 'Toor Dal 1kg',
        price: 110,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 580,
    deliveryCharge: 40,
    totalAmount: 620,
    status: 'preparing',
    createdAt: 'Today, 09:15 AM',
    timeAgo: '1 hr ago',
    estimatedDelivery: 'Today, 08 May • 4:00 PM - 5:30 PM',
    paymentMethod: 'Stripe Card',
    paymentStatus: 'Paid',
    statusTimeline: [
      {
        status: 'new',
        label: 'Order Placed',
        timestamp: '08 May 2025, 09:15 AM',
        note: 'Order placed by Suresh',
        isCompleted: true,
        isCurrent: false
      },
      {
        status: 'accepted',
        label: 'Order Accepted',
        timestamp: '08 May 2025, 09:20 AM',
        note: 'Seller confirmed items are in stock',
        isCompleted: true,
        isCurrent: false
      },
      {
        status: 'preparing',
        label: 'Preparing',
        timestamp: '08 May 2025, 09:30 AM',
        note: 'Seller is packing items at the counter',
        isCompleted: true,
        isCurrent: true
      }
    ]
  },
  {
    id: '#NK1251',
    customerName: 'Sanjay Das',
    customerPhone: '8765432100',
    customerAddress: 'Khandagiri, Bhubaneswar, Odisha 751030',
    deliveryType: 'Home Delivery',
    items: [
      {
        id: 'item_30',
        productId: 'prod_2',
        name: 'Fortune Sunflower Oil 1L',
        price: 135,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&auto=format&fit=crop&q=80'
      },
      {
        id: 'item_31',
        productId: 'prod_5',
        name: 'Parle-G Biscuit 200g',
        price: 20,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&auto=format&fit=crop&q=80'
      },
      {
        id: 'item_32',
        productId: 'prod_3',
        name: 'Tata Salt 1kg',
        price: 20,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=100&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 195,
    deliveryCharge: 15,
    totalAmount: 210,
    status: 'out_for_delivery',
    createdAt: 'Today, 08:30 AM',
    timeAgo: '2 hrs ago',
    estimatedDelivery: 'Today, 08 May • 11:30 AM - 12:30 PM',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    statusTimeline: [
      {
        status: 'new',
        label: 'Order Placed',
        timestamp: '08 May 2025, 08:30 AM',
        note: 'Order placed by Sanjay',
        isCompleted: true,
        isCurrent: false
      },
      {
        status: 'accepted',
        label: 'Order Accepted',
        timestamp: '08 May 2025, 08:35 AM',
        note: 'Seller accepted',
        isCompleted: true,
        isCurrent: false
      },
      {
        status: 'preparing',
        label: 'Preparing',
        timestamp: '08 May 2025, 08:45 AM',
        note: 'Order packed',
        isCompleted: true,
        isCurrent: false
      },
      {
        status: 'ready',
        label: 'Ready for Dispatch',
        timestamp: '08 May 2025, 09:00 AM',
        note: 'Handed to delivery partner',
        isCompleted: true,
        isCurrent: false
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        timestamp: '08 May 2025, 09:15 AM',
        note: 'Rider Deepak (9876501234) is delivering on Honda Activa',
        isCompleted: true,
        isCurrent: true
      }
    ]
  }
];

export const INITIAL_ADS: ShopAd[] = [
  {
    id: 'ad_1',
    title: 'Weekend Special: Flat 20% OFF on all Grocery Staples',
    description: 'Stock up your kitchen with fresh Atta, Basmati Rice, and cold-pressed Oils. Valid across Bhubaneswar!',
    validUntil: '2025-05-15',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    status: 'Published',
    createdAt: '08 May 2025'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev_1',
    customerName: 'Priyanka Ray',
    rating: 5,
    date: 'Yesterday',
    comment: 'Quick delivery within 25 minutes! Everything was fresh and well packed.',
    reply: 'Thank you Priyanka ji! Happy to serve you again.'
  },
  {
    id: 'rev_2',
    customerName: 'Debashish Panda',
    rating: 5,
    date: '3 days ago',
    comment: 'Sharma ji always gives genuine MRP rates and authentic products. Very trustworthy shop.',
    reply: 'Dhanyawad Debashish ji for your kind words!'
  },
  {
    id: 'rev_3',
    customerName: 'Subhashree Mishra',
    rating: 4,
    date: '1 week ago',
    comment: 'Great app experience. Tracking status updated in real-time.',
  }
];
