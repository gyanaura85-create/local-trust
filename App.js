import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, StatusBar, RefreshControl, StyleSheet, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const SUPABASE_URL = 'https://mfdiicegsgbcbvyeuxgi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I_ypFDUGPQdtct0U5FMhAQ_02rIepBx';
const SESSION_KEY = 'nearkart_admin_session_v1';
const IMAGE_URL = 'https://gaizxgufrqmmqptcycnm.supabase.co';
const IMAGE_KEY = 'sb_publishable_Ut-JmbeEfQ84Z8zoj8johg_gsKDlzQt';
const PRODUCT_CATEGORIES = [
  'Grocery','Fashion','Electronics','Home','Beauty','CHICKEN-FISH','Food','Sabzi-Phal','Dudh-Dairy',
  'Atta, Rice & Dal','Oil & Ghee','Masala','Snacks','Beverages','Dairy','Sabzi','Phal',
  'Personal Care','Home Care','Mobile & Accessories','Other'
];

async function request(path, method = 'GET', body, token) {
  let response;
  try {
    response = await fetch(SUPABASE_URL + path, {
      method,
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (e) {
    throw new Error('Internet connection check karo aur dobara try karo.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || data.msg || data.error_description || data.error || 'Request failed (' + response.status + ')');
    error.status = response.status;
    throw error;
  }
  return data;
}

const money = (value) => '₹' + Number(value || 0).toLocaleString('en-IN');
const dateText = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString('en-IN');
};

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('ssupportnearkert@gmail.com');
  const [password, setPassword] = useState('');
  const [requests, setRequests] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopSummary, setShopSummary] = useState({});
  const [activeTab, setActiveTab] = useState('shops');
  const [shopsLoading, setShopsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState('');
  const [masterProducts, setMasterProducts] = useState([]);
  const [masterLoading, setMasterLoading] = useState(false);
  const [masterName, setMasterName] = useState('');
  const [masterCategory, setMasterCategory] = useState('Grocery');
  const [masterPhoto, setMasterPhoto] = useState(null);
  const [masterSaving, setMasterSaving] = useState(false);
  const [masterSearch, setMasterSearch] = useState('');
  const [masterFilter, setMasterFilter] = useState('All');

  const loadRequests = useCallback(async (activeSession) => {
    const s = activeSession || session;
    if (!s?.access_token) return;
    setLoading(true);
    try {
      const data = await request('/rest/v1/rpc/get_admin_subscription_requests', 'POST', { p_status: 'pending' }, s.access_token);
      setRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e.status === 401) {
        await AsyncStorage.removeItem(SESSION_KEY);
        setSession(null);
        Alert.alert('Login expired', 'Please dobara login karo.');
      } else {
        Alert.alert('Requests load nahi hui', e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session]);

  const loadMasterProducts = useCallback(async (activeSession) => {
    const s = activeSession || session;
    if (!s?.access_token) return;
    setMasterLoading(true);
    try {
      const data = await request('/rest/v1/master_products?select=id,name,category,image_url,created_at&order=category.asc,name.asc', 'GET', undefined, s.access_token);
      setMasterProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e.status === 401) {
        await AsyncStorage.removeItem(SESSION_KEY);
        setSession(null);
        Alert.alert('Login expired', 'Please dobara login karo.');
      } else Alert.alert('Master products load nahi hue', e.message);
    } finally { setMasterLoading(false); }
  }, [session]);

  const pickMasterPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) { Alert.alert('Permission required', 'Gallery permission allow karo.'); return; }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      let chosen = null;
      for (const width of [900, 760, 640, 520]) {
        for (const quality of [0.78, 0.66, 0.54, 0.44]) {
          const out = await ImageManipulator.manipulateAsync(result.assets[0].uri, [{ resize: { width } }], {
            compress: quality, format: ImageManipulator.SaveFormat.JPEG, base64: true,
          });
          if (out.base64 && out.base64.length * 0.75 <= 950 * 1024) {
            chosen = { uri: out.uri, dataUri: 'data:image/jpeg;base64,' + out.base64 };
            break;
          }
        }
        if (chosen) break;
      }
      if (!chosen) throw new Error('Photo compress nahi hui. Dusri photo try karo.');
      setMasterPhoto(chosen);
    } catch (e) { Alert.alert('Photo select nahi hui', e.message || 'Please try again.'); }
  };

  const saveMasterProduct = async () => {
    const name = masterName.trim();
    if (!name) { Alert.alert('Product name required', 'Product ka naam enter karo.'); return; }
    if (!masterPhoto?.dataUri) { Alert.alert('Photo required', 'Product photo select karo.'); return; }
    if (!session?.access_token) return;
    setMasterSaving(true);
    try {
      const uploaded = await fetch(IMAGE_URL + '/functions/v1/upload-nearkart-image', {
        method: 'POST',
        headers: {
          apikey: IMAGE_KEY,
          Authorization: 'Bearer ' + session.access_token,
          'x-main-apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data_uri: masterPhoto.dataUri, folder: 'products' }),
      });
      const imageResult = await uploaded.json().catch(() => ({}));
      if (!uploaded.ok || !imageResult.url) throw new Error(imageResult.error || 'Product photo upload failed.');
      await request('/rest/v1/master_products', 'POST', {
        name, category: masterCategory, image_url: imageResult.url, created_by: session.user.id,
      }, session.access_token);
      setMasterName('');
      setMasterPhoto(null);
      Alert.alert('Saved', 'Master catalogue mein product add ho gaya.');
      await loadMasterProducts();
    } catch (e) { Alert.alert('Product save nahi hua', e.message); }
    finally { setMasterSaving(false); }
  };

  const loadShopManagement = useCallback(async (activeSession) => {
    const s = activeSession || session;
    if (!s?.access_token) return;
    setShopsLoading(true);
    try {
      const data = await request('/rest/v1/rpc/get_admin_shop_management', 'POST', {}, s.access_token);
      setShops(Array.isArray(data?.shops) ? data.shops : []);
      setShopSummary(data?.summary || {});
    } catch (e) {
      if (e.status === 401) {
        await AsyncStorage.removeItem(SESSION_KEY);
        setSession(null);
        Alert.alert('Login expired', 'Please dobara login karo.');
      } else {
        Alert.alert('Shop details load nahi hui', e.message);
      }
    } finally {
      setShopsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(SESSION_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.access_token) {
            setSession(parsed);
            await Promise.all([loadRequests(parsed), loadShopManagement(parsed), loadMasterProducts(parsed)]);
          }
        }
      } catch (e) {}
      setBooting(false);
    })();
  }, []);

  const login = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Details required', 'Email aur password enter karo.');
      return;
    }
    setLoading(true);
    try {
      const data = await request('/auth/v1/token?grant_type=password', 'POST', {
        email: email.trim().toLowerCase(),
        password,
      });
      if (!data.access_token || !data.user?.id) throw new Error('Login response incomplete.');
      const next = { access_token: data.access_token, refresh_token: data.refresh_token, user: data.user };
      setSession(next);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setPassword('');
      await Promise.all([loadRequests(next), loadShopManagement(next), loadMasterProducts(next)]);
    } catch (e) {
      Alert.alert('Login failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { if (session?.access_token) await request('/auth/v1/logout', 'POST', {}, session.access_token); } catch (e) {}
    await AsyncStorage.removeItem(SESSION_KEY);
    setSession(null);
    setRequests([]);
    setShops([]);
    setShopSummary({});
    setMasterProducts([]);
  };

  const approve = (item) => {
    Alert.alert('Approve subscription?', 'Payment verify karne ke baad hi ' + (item.shop_name || 'is shop') + ' ko approve karein.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: async () => {
        setBusyId(item.payment_id || item.id);
        try {
          await request('/rest/v1/rpc/approve_shop_subscription_payment', 'POST',
            { p_payment_id: item.payment_id || item.id }, session.access_token);
          Alert.alert('Approved', 'Subscription approve ho gaya aur shop activate ho gayi.');
          await Promise.all([loadRequests(), loadShopManagement()]);
        } catch (e) { Alert.alert('Approval failed', e.message); }
        finally { setBusyId(''); }
      }},
    ]);
  };

  const reject = async () => {
    if (!rejecting) return;
    const item = rejecting;
    setBusyId(item.payment_id || item.id);
    try {
      await request('/rest/v1/rpc/reject_shop_subscription_payment', 'POST',
        { p_payment_id: item.payment_id || item.id, p_reason: reason.trim() || 'Payment could not be verified' },
        session.access_token);
      setRejecting(null);
      setReason('');
      Alert.alert('Rejected', 'Subscription request reject kar di gayi.');
      await Promise.all([loadRequests(), loadShopManagement()]);
    } catch (e) { Alert.alert('Rejection failed', e.message); }
    finally { setBusyId(''); }
  };

  if (booting) return <View style={styles.center}><ActivityIndicator size="large" color="#1457c5" /></View>;

  if (!session) return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#102b58" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.loginWrap}>
        <View pointerEvents="none" style={styles.glowOne} />
        <View pointerEvents="none" style={styles.glowTwo} />
        <View style={styles.loginContent}>
          <View style={styles.brandMark}><Text style={styles.brandK}>NK</Text></View>
          <Text style={styles.brand}>NearKart <Text style={styles.brandAccent}>Admin</Text></Text>
          <Text style={styles.subBrand}>YOUR STORE NETWORK, UNDER CONTROL</Text>
          <View style={styles.panel}>
            <View style={styles.secureTag}><Text style={styles.secureTagText}>SECURE ADMIN PORTAL</Text></View>
            <Text style={styles.panelTitle}>Welcome back</Text>
            <Text style={styles.panelSub}>Sign in to manage shops, subscriptions and the master product catalogue.</Text>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Admin email" placeholderTextColor="#94a3b8" />
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter password" placeholderTextColor="#94a3b8" />
            <TouchableOpacity style={[styles.primaryBtn, loading && styles.primaryDisabled]} onPress={login} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>SIGN IN  ›</Text>}
            </TouchableOpacity>
            <Text style={styles.hint}>Authorized NearKart administrators only.</Text>
          </View>
          <Text style={styles.footerNote}>NEARKART  •  ADMIN CONSOLE</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#102b58" />
      <View style={styles.header}>
        <View style={styles.headerBrandRow}>
          <View style={styles.headerMark}><Text style={styles.headerMarkText}>NK</Text></View>
          <View><Text style={styles.headerEyebrow}>CONTROL CENTER</Text><Text style={styles.headerTitle}>NearKart Admin</Text><Text style={styles.headerSub}>Shop, subscriptions & master catalogue</Text></View>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}><Text style={styles.logoutText}>↗  Logout</Text></TouchableOpacity>
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('shops')} style={[styles.tabButton, activeTab === 'shops' && styles.tabActive]}>
          <Text style={[styles.tabText, activeTab === 'shops' && styles.tabTextActive]}>🏪  Shops</Text>
          <Text style={[styles.tabHint, activeTab === 'shops' && styles.tabHintActive]}>Management</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('payments')} style={[styles.tabButton, activeTab === 'payments' && styles.tabActive]}>
          <Text style={[styles.tabText, activeTab === 'payments' && styles.tabTextActive]}>₹  Payments</Text>
          <Text style={[styles.tabHint, activeTab === 'payments' && styles.tabHintActive]}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setActiveTab('catalogue'); loadMasterProducts(); }} style={[styles.tabButton, activeTab === 'catalogue' && styles.tabActive]}>
          <Text style={[styles.tabText, activeTab === 'catalogue' && styles.tabTextActive]}>▦  Products</Text>
          <Text style={[styles.tabHint, activeTab === 'catalogue' && styles.tabHintActive]}>Catalogue</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'catalogue' ? (
        <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={masterLoading} onRefresh={() => loadMasterProducts()} />}>
          <View style={styles.card}>
            <Text style={styles.shopName}>Add Master Product</Text>
            <Text style={styles.owner}>Yahan add kiya product sabhi sellers ke catalogue mein available hoga.</Text>
            <Text style={styles.label}>PRODUCT NAME</Text>
            <TextInput style={styles.input} value={masterName} onChangeText={setMasterName} placeholder="Enter product name" placeholderTextColor="#94a3b8" maxLength={120} />
            <Text style={styles.label}>SELECT CATEGORY</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
              {PRODUCT_CATEGORIES.map((cat) => (
                <TouchableOpacity key={cat} onPress={() => setMasterCategory(cat)} style={{ paddingHorizontal: 11, paddingVertical: 9, borderRadius: 20, backgroundColor: masterCategory === cat ? '#087f70' : '#edf2f7', borderWidth: 1, borderColor: masterCategory === cat ? '#087f70' : '#dce5ef', marginBottom: 2 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: masterCategory === cat ? '#fff' : '#52647c' }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>PRODUCT PHOTO</Text>
            <TouchableOpacity onPress={pickMasterPhoto} style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#9aabbf', borderRadius: 14, minHeight: 145, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafd', overflow: 'hidden' }}>
              {masterPhoto?.uri ? <Image source={{ uri: masterPhoto.uri }} style={{ width: 132, height: 132, borderRadius: 12 }} resizeMode="cover" /> : <Text style={{ color: '#52647c', fontWeight: '800' }}>＋  Select product photo</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, masterSaving && styles.primaryDisabled]} onPress={saveMasterProduct} disabled={masterSaving}>
              {masterSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>SAVE MASTER PRODUCT</Text>}
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { paddingBottom: 10 }]}>
            <View style={styles.cardTop}>
              <Text style={styles.shopName}>Master Catalogue</Text>
              <Text style={styles.pending}>{masterProducts.length} PRODUCTS</Text>
            </View>
            <TextInput style={[styles.input, { marginTop: 14 }]} value={masterSearch} onChangeText={setMasterSearch} placeholder="Search product name..." placeholderTextColor="#94a3b8" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, marginBottom: 5 }}>
              <TouchableOpacity onPress={() => setMasterFilter('All')} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, backgroundColor: masterFilter === 'All' ? '#087f70' : '#edf2f7', marginRight: 7 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: masterFilter === 'All' ? '#fff' : '#52647c' }}>All</Text>
              </TouchableOpacity>
              {PRODUCT_CATEGORIES.map(cat => (
                <TouchableOpacity key={cat} onPress={() => setMasterFilter(cat)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, backgroundColor: masterFilter === cat ? '#087f70' : '#edf2f7', marginRight: 7 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: masterFilter === cat ? '#fff' : '#52647c' }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {masterLoading ? <ActivityIndicator style={{ margin: 20 }} color="#087f70" /> : masterProducts.filter(p => (masterFilter === 'All' || p.category === masterFilter) && (p.name + ' ' + p.category).toLowerCase().includes(masterSearch.trim().toLowerCase())).map((p) => (
              <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#edf1f6' }}>
                <Image source={{ uri: p.image_url }} style={{ width: 56, height: 56, borderRadius: 11, backgroundColor: '#edf1f6' }} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: '#172b4d' }}>{p.name}</Text>
                  <Text style={{ fontSize: 11, color: '#718198', marginTop: 4 }}>{p.category}</Text>
                </View>
              </View>
            ))}
            {!masterLoading && masterProducts.filter(p => (masterFilter === 'All' || p.category === masterFilter) && (p.name + ' ' + p.category).toLowerCase().includes(masterSearch.trim().toLowerCase())).length === 0 ? <Text style={styles.emptyText}>Is filter mein abhi koi product nahi hai.</Text> : null}
          </View>
        </ScrollView>
      ) : activeTab === 'shops' ? (
        <>
          <View style={styles.shopSummaryGrid}>
            <View style={styles.shopStat}><Text style={styles.shopStatNumber}>{shopSummary.total_shops || 0}</Text><Text style={styles.shopStatLabel}>TOTAL SHOPS</Text></View>
            <View style={styles.shopStat}><Text style={styles.shopStatNumber}>{shopSummary.payment_pending || 0}</Text><Text style={styles.shopStatLabel}>PAYMENT PENDING</Text></View>
            <View style={styles.shopStat}><Text style={styles.shopStatNumber}>{shopSummary.not_paid || 0}</Text><Text style={styles.shopStatLabel}>NOT PAID</Text></View>
            <View style={styles.shopStat}><Text style={styles.shopStatNumber}>{shopSummary.active || 0}</Text><Text style={styles.shopStatLabel}>ACTIVE</Text></View>
            <View style={styles.shopStat}><Text style={styles.shopStatNumber}>{shopSummary.expired || 0}</Text><Text style={styles.shopStatLabel}>EXPIRED</Text></View>
          </View>
          <ScrollView contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={shopsLoading} onRefresh={() => loadShopManagement()} />}>
            {shops.length === 0 && !shopsLoading ? (
              <View style={styles.empty}><Text style={styles.emptyTitle}>No shops found</Text><Text style={styles.emptyText}>Registered shops yahan dikhenge.</Text><TouchableOpacity style={styles.outlineBtn} onPress={() => loadShopManagement()}><Text style={styles.outlineText}>Refresh</Text></TouchableOpacity></View>
            ) : shops.map((item) => {
              const status = item.admin_status || 'not_paid';
              const statusLabel = status === 'payment_pending' ? 'PAYMENT PENDING' : status.replace('_', ' ').toUpperCase();
              return (
                <View key={item.shop_id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.shopName}>{item.shop_name || 'Shop'}</Text>
                    <Text style={[styles.shopStatus, status === 'active' ? styles.statusActive : status === 'payment_pending' ? styles.statusPending : status === 'expired' ? styles.statusExpired : styles.statusUnpaid]}>{statusLabel}</Text>
                  </View>
                  <Text style={styles.owner}>{item.owner_name || 'Owner'} {item.phone ? '• ' + item.phone : ''}</Text>
                  <Text style={styles.shopLocation}>{[item.address, item.area].filter(Boolean).join(', ') || 'Location not provided'}</Text>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoCell}><Text style={styles.infoLabel}>THIS MONTH ORDERS</Text><Text style={styles.infoValue}>{item.orders_this_month || 0}</Text></View>
                    <View style={styles.infoCell}><Text style={styles.infoLabel}>LAST 365 DAYS</Text><Text style={styles.infoValue}>{item.orders_last_365_days || 0}</Text></View>
                  </View>
                  <View style={styles.detailLine}><Text style={styles.detailLabel}>Category / Email</Text><Text style={styles.detailValue}>{[item.category, item.email].filter(Boolean).join(' • ') || '—'}</Text></View>
                  <View style={styles.detailLine}><Text style={styles.detailLabel}>Subscription period</Text><Text style={styles.detailValue}>Start: {dateText(item.subscription_started_at)}{'\n'}Expiry: {dateText(item.subscription_expires_at)}</Text></View>
                  <View style={styles.detailLine}><Text style={styles.detailLabel}>Latest payment / UTR</Text><Text selectable style={styles.detailValue}>{money(item.latest_payment_amount)}  •  {item.latest_payment_utr || 'UTR not submitted'}</Text></View>
                  <View style={styles.detailLine}><Text style={styles.detailLabel}>Payment status / Submitted</Text><Text style={styles.detailValue}>{(item.latest_payment_status || 'No payment record').toUpperCase()}  •  {dateText(item.payment_submitted_at)}</Text></View>
                  <View style={styles.detailLine}><Text style={styles.detailLabel}>Payment reviewed at</Text><Text style={styles.detailValue}>{dateText(item.payment_reviewed_at)}</Text></View>
                </View>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.summary}>
            <View style={styles.summaryIcon}><Text style={styles.summaryIconText}>⌁</Text></View>
            <View style={styles.summaryCopy}><Text style={styles.summaryLabel}>PENDING REQUESTS</Text><Text style={styles.summaryCaption}>Payments waiting for verification</Text></View>
            <Text style={styles.summaryNumber}>{requests.length}</Text>
          </View>
          <ScrollView contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => loadRequests()} />}>
            {requests.length === 0 && !loading ? (
              <View style={styles.empty}><Text style={styles.emptyTitle}>No pending requests</Text><Text style={styles.emptyText}>New seller subscription payments yahan dikhenge.</Text><TouchableOpacity style={styles.outlineBtn} onPress={() => loadRequests()}><Text style={styles.outlineText}>Refresh</Text></TouchableOpacity></View>
            ) : requests.map((item, index) => {
              const id = item.payment_id || item.id || String(index);
              const working = busyId === id;
              return (
                <View key={id} style={styles.card}>
                  <View style={styles.cardTop}><Text style={styles.shopName}>{item.shop_name || 'Shop'}</Text><Text style={styles.pending}>PENDING</Text></View>
                  <Text style={styles.owner}>{item.owner_name || 'Seller'} {item.phone ? '• ' + item.phone : ''}</Text>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoCell}><Text style={styles.infoLabel}>AMOUNT</Text><Text style={styles.infoValue}>{money(item.amount)}</Text></View>
                    <View style={styles.infoCell}><Text style={styles.infoLabel}>AREA</Text><Text style={styles.infoValue}>{item.area || '—'}</Text></View>
                  </View>
                  <View style={styles.detailLine}><Text style={styles.detailLabel}>UTR / Transaction ID</Text><Text selectable style={styles.detailValue}>{item.utr || '—'}</Text></View>
                  <View style={styles.detailLine}><Text style={styles.detailLabel}>Submitted</Text><Text style={styles.detailValue}>{dateText(item.submitted_at)}</Text></View>
                  <View style={styles.actions}>
                    <TouchableOpacity style={[styles.approveBtn, working && styles.disabled]} disabled={!!busyId} onPress={() => approve(item)}><Text style={styles.actionText}>{working ? 'Please wait…' : 'Approve'}</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.rejectBtn, working && styles.disabled]} disabled={!!busyId} onPress={() => { setRejecting(item); setReason(''); }}><Text style={styles.actionText}>Reject</Text></TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
      {rejecting && (
        <View style={styles.modalShade}>
          <View style={styles.modal}>
            <Text style={styles.panelTitle}>Reject subscription</Text>
            <Text style={styles.label}>Reason (optional)</Text>
            <TextInput style={[styles.input, styles.reasonInput]} value={reason} onChangeText={setReason} multiline placeholder="Payment could not be verified" placeholderTextColor="#8a96a8" />
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setRejecting(null)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={reject} disabled={!!busyId}><Text style={styles.actionText}>Confirm Reject</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#f4f7fc'},
  center:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#f4f7fc'},
  loginWrap:{flex:1,justifyContent:'center',paddingHorizontal:22,backgroundColor:'#0b1d3a',overflow:'hidden'},
  loginContent:{width:'100%',maxWidth:460,alignSelf:'center'},
  glowOne:{position:'absolute',width:280,height:280,borderRadius:140,backgroundColor:'#153d68',top:-115,right:-100,opacity:.8},
  glowTwo:{position:'absolute',width:220,height:220,borderRadius:110,backgroundColor:'#123f4c',bottom:-95,left:-95,opacity:.65},
  brandMark:{width:68,height:68,borderRadius:22,backgroundColor:'#e5fbf5',alignItems:'center',justifyContent:'center',alignSelf:'center',marginBottom:15,borderWidth:1,borderColor:'#8ce4ce'},
  brandK:{fontSize:25,fontWeight:'900',color:'#087f70',letterSpacing:-1},
  brand:{fontSize:30,fontWeight:'900',color:'#fff',textAlign:'center',letterSpacing:-.8},
  brandAccent:{color:'#62dfc3'},
  subBrand:{fontSize:10,fontWeight:'800',letterSpacing:2,color:'#a9bfdc',textAlign:'center',marginTop:8,marginBottom:28},
  panel:{backgroundColor:'#fff',borderRadius:25,padding:22,borderWidth:1,borderColor:'#e6edf5',shadowColor:'#000',shadowOpacity:.2,shadowRadius:24,shadowOffset:{width:0,height:12},elevation:12},
  secureTag:{alignSelf:'flex-start',backgroundColor:'#e7f8f3',borderRadius:20,paddingHorizontal:11,paddingVertical:6,marginBottom:17},
  secureTagText:{fontSize:9,fontWeight:'900',letterSpacing:1.1,color:'#087f70'},
  panelTitle:{fontSize:25,fontWeight:'900',color:'#122743',letterSpacing:-.5},
  panelSub:{fontSize:13,color:'#75849a',marginTop:5,marginBottom:8},
  label:{fontSize:10,fontWeight:'900',color:'#53647d',marginBottom:8,marginTop:17,letterSpacing:1},
  input:{borderWidth:1,borderColor:'#dce5ef',borderRadius:13,paddingHorizontal:15,paddingVertical:14,fontSize:15,color:'#172b4d',backgroundColor:'#f8fafd'},
  primaryBtn:{backgroundColor:'#087f70',borderRadius:13,padding:16,alignItems:'center',justifyContent:'center',marginTop:24,minHeight:52,shadowColor:'#087f70',shadowOpacity:.22,shadowRadius:12,shadowOffset:{width:0,height:6},elevation:5},
  primaryDisabled:{opacity:.7},
  primaryText:{color:'#fff',fontWeight:'900',letterSpacing:1.2,fontSize:13},
  hint:{fontSize:11,color:'#8795a8',lineHeight:17,marginTop:17,textAlign:'center'},
  footerNote:{fontSize:9,color:'#7e98b8',letterSpacing:2,fontWeight:'800',textAlign:'center',marginTop:25},
  header:{backgroundColor:'#0b1d3a',paddingHorizontal:16,paddingTop:12,paddingBottom:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomLeftRadius:20,borderBottomRightRadius:20},
  headerBrandRow:{flexDirection:'row',alignItems:'center',flex:1},
  headerMark:{width:40,height:40,borderRadius:13,backgroundColor:'#dff8f1',alignItems:'center',justifyContent:'center',marginRight:10},
  headerMarkText:{fontSize:16,fontWeight:'900',color:'#087f70'},
  headerEyebrow:{fontSize:9,fontWeight:'900',color:'#65d9bd',letterSpacing:1.8,marginBottom:3},
  headerTitle:{fontSize:19,fontWeight:'900',color:'#fff',letterSpacing:-.4},
  headerSub:{fontSize:10,color:'#b3c4da',marginTop:3},
  logoutBtn:{borderWidth:1,borderColor:'#516783',borderRadius:11,paddingHorizontal:11,paddingVertical:9,marginLeft:8},
  logoutText:{color:'#fff',fontWeight:'800',fontSize:11},
  tabBar:{flexDirection:'row',marginHorizontal:12,marginTop:12,marginBottom:5,backgroundColor:'#e7edf5',borderRadius:15,padding:4,borderWidth:1,borderColor:'#dce5ef'},
  tabButton:{flex:1,minWidth:0,paddingVertical:10,paddingHorizontal:3,borderRadius:11,alignItems:'center',justifyContent:'center'},
  tabActive:{backgroundColor:'#fff',borderWidth:1,borderColor:'#ccebe3',shadowColor:'#19314f',shadowOpacity:.1,shadowRadius:5,elevation:3},
  tabText:{fontSize:10,fontWeight:'900',color:'#42536b',textAlign:'center'},
  tabTextActive:{color:'#087f70'},
  tabHint:{fontSize:9,fontWeight:'700',color:'#718198',marginTop:3,textAlign:'center'},
  tabHintActive:{color:'#087f70'},
  shopSummaryGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginHorizontal:12,marginTop:10,marginBottom:12},
  shopStat:{minWidth:'30%',flexGrow:1,backgroundColor:'#fff',borderRadius:14,padding:11,borderWidth:1,borderColor:'#e7edf5'},
  shopStatNumber:{fontSize:22,fontWeight:'900',color:'#173657'},
  shopStatLabel:{fontSize:8,fontWeight:'900',letterSpacing:.5,color:'#8291a5',marginTop:4},
  shopStatus:{fontSize:8,fontWeight:'900',paddingHorizontal:8,paddingVertical:6,borderRadius:20,overflow:'hidden'},
  statusActive:{color:'#087f70',backgroundColor:'#e4f7f2'},
  statusPending:{color:'#986000',backgroundColor:'#fff2d6'},
  statusExpired:{color:'#a13d4c',backgroundColor:'#ffebee'},
  statusUnpaid:{color:'#5c6c82',backgroundColor:'#edf1f6'},
  shopLocation:{fontSize:11,color:'#60738b',marginTop:6,lineHeight:16},
  summary:{backgroundColor:'#fff',marginHorizontal:15,marginTop:15,marginBottom:16,padding:16,borderRadius:18,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#e8eef5',shadowColor:'#19314f',shadowOpacity:.06,shadowRadius:12,shadowOffset:{width:0,height:5},elevation:3},
  summaryIcon:{width:43,height:43,borderRadius:14,backgroundColor:'#e4f7f2',alignItems:'center',justifyContent:'center',marginRight:12},
  summaryIconText:{fontSize:25,fontWeight:'900',color:'#087f70'},
  summaryCopy:{flex:1},
  summaryLabel:{fontSize:10,fontWeight:'900',color:'#52657d',letterSpacing:1.1},
  summaryCaption:{fontSize:10,color:'#91a0b2',marginTop:4},
  summaryNumber:{fontSize:30,fontWeight:'900',color:'#087f70',marginLeft:8},
  list:{paddingHorizontal:12,paddingTop:5,paddingBottom:34},
  empty:{backgroundColor:'#fff',borderRadius:20,padding:27,alignItems:'center',marginTop:7,borderWidth:1,borderColor:'#e8eef5'},
  emptyTitle:{fontSize:18,fontWeight:'900',color:'#172b4d'},
  emptyText:{fontSize:12,color:'#8190a4',textAlign:'center',marginTop:8,lineHeight:19},
  outlineBtn:{borderWidth:1,borderColor:'#087f70',borderRadius:11,paddingHorizontal:22,paddingVertical:11,marginTop:18,backgroundColor:'#f1fbf8'},
  outlineText:{color:'#087f70',fontWeight:'900',fontSize:12},
  card:{backgroundColor:'#fff',borderRadius:19,padding:17,marginBottom:14,borderWidth:1,borderColor:'#e7edf5',shadowColor:'#19314f',shadowOpacity:.05,shadowRadius:10,shadowOffset:{width:0,height:4},elevation:2},
  cardTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  shopName:{fontSize:17,fontWeight:'900',color:'#172b4d',flex:1,letterSpacing:-.2},
  pending:{fontSize:9,fontWeight:'900',color:'#986000',backgroundColor:'#fff2d6',paddingHorizontal:10,paddingVertical:6,borderRadius:20,overflow:'hidden',letterSpacing:.6},
  owner:{fontSize:12,color:'#78879b',marginTop:7},
  infoGrid:{flexDirection:'row',marginTop:17,backgroundColor:'#f6f9fc',borderRadius:13,padding:12},
  infoCell:{flex:1},
  infoLabel:{fontSize:9,fontWeight:'900',color:'#8998aa',letterSpacing:1},
  infoValue:{fontSize:15,fontWeight:'900',color:'#1a3453',marginTop:5},
  detailLine:{borderTopWidth:1,borderTopColor:'#edf1f6',paddingTop:11,marginTop:12},
  detailLabel:{fontSize:10,color:'#8b99aa',fontWeight:'700'},
  detailValue:{fontSize:12,fontWeight:'800',color:'#263b5c',marginTop:4},
  actions:{flexDirection:'row',gap:10,marginTop:17},
  approveBtn:{flex:1,backgroundColor:'#087f70',padding:14,borderRadius:12,alignItems:'center'},
  rejectBtn:{flex:1,backgroundColor:'#d84c5c',padding:14,borderRadius:12,alignItems:'center'},
  actionText:{color:'#fff',fontWeight:'900',fontSize:12,letterSpacing:.3},
  disabled:{opacity:.55},
  cancelBtn:{flex:1,backgroundColor:'#edf1f6',padding:14,borderRadius:12,alignItems:'center'},
  cancelText:{color:'#34445d',fontWeight:'900'},
  modalShade:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(4,14,30,.62)',justifyContent:'center',padding:22},
  modal:{backgroundColor:'#fff',borderRadius:21,padding:20,borderWidth:1,borderColor:'#e7edf5'},
  reasonInput:{minHeight:90,textAlignVertical:'top'}
});
