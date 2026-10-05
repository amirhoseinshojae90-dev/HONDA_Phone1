import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { usePhone1 } from '../src/state/Phone1Provider';

export default function GPS() {
  const { gps, resetDistance } = usePhone1();

  return (
    <View style={styles.page}>
      <Text style={styles.title}>GPS</Text>
      <View style={styles.card}>
        <Text style={styles.row}>Latitude: {gps.latitude ?? '--'}</Text>
        <Text style={styles.row}>Longitude: {gps.longitude ?? '--'}</Text>
        <Text style={styles.row}>Accuracy: {gps.accuracy != null ? `${gps.accuracy.toFixed(1)} m` : '--'}</Text>
        <Text style={styles.row}>Speed: {gps.speedMps != null ? `${(gps.speedMps * 3.6).toFixed(1)} km/h` : '--'}</Text>
        <Text style={styles.row}>Distance: {(gps.distanceMeters / 1000).toFixed(3)} km</Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.btn} onPress={resetDistance}><Text style={styles.btnText}>صفر کردن مسافت</Text></Pressable>
        <Pressable style={styles.btn} onPress={() => router.back()}><Text style={styles.btnText}>بازگشت</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#06080b', padding: 24, gap: 18 },
  title: { color: '#fff', fontSize: 34, fontWeight: '900' },
  card: { backgroundColor: '#10151b', borderRadius: 18, padding: 22, gap: 16 },
  row: { color: '#dce3ec', fontSize: 17 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { backgroundColor: '#1d2630', padding: 14, borderRadius: 12, flex: 1 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '800' },
});
