import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { usePhone1 } from '../src/state/Phone1Provider';

export default function Settings() {
  const { espIp, setEspIp, refreshEsp, esp } = usePhone1();
  const [value, setValue] = useState(espIp);

  const save = async () => {
    const clean = value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '') || '192.168.1.50';
    setEspIp(clean);
    await refreshEsp(clean);
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>تنظیمات HONDA</Text>
      <Text style={styles.label}>IP محلی ESP8266</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numbers-and-punctuation"
        style={styles.input}
        placeholder="192.168.1.50"
        placeholderTextColor="#667080"
      />
      <Pressable style={styles.btn} onPress={save}><Text style={styles.btnText}>ذخیره و اتصال</Text></Pressable>
      <View style={styles.status}>
        <Text style={styles.statusText}>وضعیت ESP: {esp.ok ? 'ONLINE' : 'OFFLINE'}</Text>
        <Text style={styles.statusText}>IP: {esp.ip}</Text>
        <Text style={styles.statusText}>خطا: {esp.error ?? 'ندارد'}</Text>
      </View>
      <Pressable style={styles.btn} onPress={() => router.back()}><Text style={styles.btnText}>بازگشت</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#06080b', padding: 24, gap: 14 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 8 },
  label: { color: '#aeb7c4', fontSize: 14 },
  input: { backgroundColor: '#10151b', color: '#fff', borderRadius: 14, padding: 16, fontSize: 18 },
  btn: { backgroundColor: '#1d2630', padding: 15, borderRadius: 12 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '800' },
  status: { backgroundColor: '#10151b', borderRadius: 14, padding: 16, gap: 8 },
  statusText: { color: '#d9e1eb' },
});
