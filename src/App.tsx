/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/common/AppLayout';

// Auth Screens
import { SplashScreen } from './components/auth/SplashScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { OtpScreen } from './components/auth/OtpScreen';
import { RoleSelectScreen } from './components/auth/RoleSelectScreen';
import { SellerRegisterScreen } from './components/auth/SellerRegisterScreen';
import { BuyerProfileScreen } from './components/auth/BuyerProfileScreen';

// Seller Screens
import { SellerDashboard } from './components/seller/SellerDashboard';
import { SellerOrders } from './components/seller/SellerOrders';
import { SellerOrderDetails } from './components/seller/SellerOrderDetails';
import { SellerProducts } from './components/seller/SellerProducts';
import { SellerAddProduct } from './components/seller/SellerAddProduct';
import { SellerCreateAd } from './components/seller/SellerCreateAd';
import { SellerMoreMenu } from './components/seller/SellerMoreMenu';
import { SellerMoreSubscreens } from './components/seller/SellerMoreSubscreens';

// Buyer Screens
import { BuyerHome } from './components/buyer/BuyerHome';
import { BuyerCategories } from './components/buyer/BuyerCategories';
import { BuyerShopView } from './components/buyer/BuyerShopView';
import { BuyerCart } from './components/buyer/BuyerCart';
import { BuyerOrders } from './components/buyer/BuyerOrders';
import { BuyerTrackOrder } from './components/buyer/BuyerTrackOrder';
import { BuyerProfile } from './components/buyer/BuyerProfile';

const ScreenRouter: React.FC = () => {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    // Auth
    case 'splash':
      return <SplashScreen />;
    case 'login':
      return <LoginScreen />;
    case 'otp':
      return <OtpScreen />;
    case 'role_select':
      return <RoleSelectScreen />;
    case 'seller_register':
      return <SellerRegisterScreen />;
    case 'buyer_profile':
      return <BuyerProfileScreen />;

    // Seller
    case 'seller_dashboard':
      return <SellerDashboard />;
    case 'seller_orders':
      return <SellerOrders />;
    case 'seller_order_details':
      return <SellerOrderDetails />;
    case 'seller_products':
      return <SellerProducts />;
    case 'seller_add_product':
      return <SellerAddProduct />;
    case 'seller_create_ad':
      return <SellerCreateAd />;
    case 'seller_more':
      return <SellerMoreMenu />;
    case 'seller_more_subscreen':
      return <SellerMoreSubscreens />;

    // Buyer
    case 'buyer_home':
      return <BuyerHome />;
    case 'buyer_categories':
      return <BuyerCategories />;
    case 'buyer_shop_view':
      return <BuyerShopView />;
    case 'buyer_cart':
      return <BuyerCart />;
    case 'buyer_orders':
      return <BuyerOrders />;
    case 'buyer_track_order':
      return <BuyerTrackOrder />;
    case 'buyer_profile_view':
      return <BuyerProfile />;

    default:
      return <SellerDashboard />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <AppLayout>
        <ScreenRouter />
      </AppLayout>
    </AppProvider>
  );
}
