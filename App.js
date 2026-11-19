import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, StatusBar, RefreshControl, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://mfdiicegsgbcbvyeuxgi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I_ypFDUGPQdtct0U5FMhAQ_02rIepBx';
const SESSION_KEY = 'nearkart_admin_session_v1';

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
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState('');

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

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(SESSION_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.access_token) {
            setSession(parsed);
            await loadRequests(parsed);
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
      await loadRequests(next);
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
          await loadRequests();
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
      await loadRequests();
    } catch (e) { Alert.alert('Rejection failed', e.message); }
    finally { setBusyId(''); }
  };

  if (booting) return <View style={styles.center}><ActivityIndicator size="large" color="#1457c5" /></View>;

  if (!session) return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#102b58" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.loginWrap}>
        <View style={styles.brandMark}><Text style={styles.brandK}>NK</Text></View>
        <Text style={styles.brand}>NearKart Admin</Text>
        <Text style={styles.subBrand}>Private shop & subscription management</Text>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Admin Login</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Admin email" placeholderTextColor="#8a96a8" />
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter password" placeholderTextColor="#8a96a8" />
          <TouchableOpacity style={styles.primaryBtn} onPress={login} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>LOGIN</Text>}
          </TouchableOpacity>
          <Text style={styles.hint}>Only an authorized NearKart administrator can access this app.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#102b58" />
      <View style={styles.header}>
        <View><Text style={styles.headerTitle}>NearKart Admin</Text><Text style={styles.headerSub}>Subscription requests</Text></View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>PENDING REQUESTS</Text>
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
  safe:{flex:1,backgroundColor:'#f3f6fb'}, center:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#f3f6fb'},
  loginWrap:{flex:1,justifyContent:'center',padding:24,backgroundColor:'#102b58'},
  brandMark:{width:66,height:66,borderRadius:20,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',alignSelf:'center',marginBottom:14},
  brandK:{fontSize:25,fontWeight:'900',color:'#1457c5'},brand:{fontSize:29,fontWeight:'900',color:'#fff',textAlign:'center'},subBrand:{fontSize:13,color:'#c8d7ef',textAlign:'center',marginTop:6,marginBottom:28},
  panel:{backgroundColor:'#fff',borderRadius:18,padding:20},panelTitle:{fontSize:20,fontWeight:'800',color:'#172b4d',marginBottom:18},
  label:{fontSize:12,fontWeight:'700',color:'#53627a',marginBottom:7,marginTop:12},input:{borderWidth:1,borderColor:'#dce3ed',borderRadius:11,paddingHorizontal:13,paddingVertical:12,fontSize:15,color:'#172b4d',backgroundColor:'#fff'},
  primaryBtn:{backgroundColor:'#1457c5',borderRadius:11,padding:15,alignItems:'center',marginTop:22},primaryText:{color:'#fff',fontWeight:'900',letterSpacing:1},
  hint:{fontSize:11,color:'#78869a',lineHeight:17,marginTop:16,textAlign:'center'},
  header:{backgroundColor:'#102b58',paddingHorizontal:20,paddingTop:14,paddingBottom:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  headerTitle:{fontSize:22,fontWeight:'900',color:'#fff'},headerSub:{fontSize:12,color:'#c8d7ef',marginTop:3},logoutBtn:{borderWidth:1,borderColor:'#8298bb',borderRadius:9,paddingHorizontal:13,paddingVertical:8},logoutText:{color:'#fff',fontWeight:'700'},
  summary:{backgroundColor:'#fff',margin:14,padding:16,borderRadius:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},summaryLabel:{fontSize:12,fontWeight:'800',color:'#62728a',letterSpacing:1},summaryNumber:{fontSize:28,fontWeight:'900',color:'#1457c5'},
  list:{paddingHorizontal:14,paddingBottom:30},empty:{backgroundColor:'#fff',borderRadius:15,padding:24,alignItems:'center',marginTop:8},emptyTitle:{fontSize:17,fontWeight:'800',color:'#172b4d'},emptyText:{fontSize:13,color:'#748197',textAlign:'center',marginTop:7},outlineBtn:{borderWidth:1,borderColor:'#1457c5',borderRadius:9,paddingHorizontal:20,paddingVertical:10,marginTop:16},outlineText:{color:'#1457c5',fontWeight:'800'},
  card:{backgroundColor:'#fff',borderRadius:15,padding:16,marginBottom:13,borderWidth:1,borderColor:'#e3e9f2'},cardTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},shopName:{fontSize:17,fontWeight:'900',color:'#172b4d',flex:1},pending:{fontSize:10,fontWeight:'900',color:'#a96500',backgroundColor:'#fff2d8',paddingHorizontal:9,paddingVertical:5,borderRadius:7},owner:{fontSize:13,color:'#65748a',marginTop:6},infoGrid:{flexDirection:'row',marginTop:16},infoCell:{flex:1},infoLabel:{fontSize:10,fontWeight:'800',color:'#8a96a8'},infoValue:{fontSize:15,fontWeight:'800',color:'#172b4d',marginTop:4},detailLine:{borderTopWidth:1,borderTopColor:'#edf0f5',paddingTop:10,marginTop:11},detailLabel:{fontSize:11,color:'#8490a2'},detailValue:{fontSize:13,fontWeight:'700',color:'#263b5c',marginTop:3},
  actions:{flexDirection:'row',gap:10,marginTop:16},approveBtn:{flex:1,backgroundColor:'#16804c',padding:13,borderRadius:10,alignItems:'center'},rejectBtn:{flex:1,backgroundColor:'#c83b4d',padding:13,borderRadius:10,alignItems:'center'},actionText:{color:'#fff',fontWeight:'900'},disabled:{opacity:.55},cancelBtn:{flex:1,backgroundColor:'#e8edf5',padding:13,borderRadius:10,alignItems:'center'},cancelText:{color:'#34445d',fontWeight:'800'},
  modalShade:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(0,0,0,.45)',justifyContent:'center',padding:22},modal:{backgroundColor:'#fff',borderRadius:16,padding:18},reasonInput:{minHeight:85,textAlignVertical:'top'}
});
