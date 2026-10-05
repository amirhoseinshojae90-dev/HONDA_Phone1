import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { usePhone1 } from '../src/state/Phone1Provider';

function Cell({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function Sensors() {
  const { esp, motion } = usePhone1();

  return (
    <View style={styles.page}>
      <Text style={styles.title}>سنسورها و وضعیت ESP</Text>
      <View style={styles.grid}>
        <Cell title="دما" value={esp.temperatureC != null ? `${esp.temperatureC.toFixed(1)} °C` : '--'} />
        <Cell title="LDR" value={esp.ldrNight ? 'شب' : 'روز'} />
        <Cell title="FC-51" value={esp.fc51 ? 'فعال' : 'آزاد'} />
        <Cell title="Ignition" value={esp.ignition ? 'ON' : 'OFF'} />
        <Cell title="Charger" value={esp.charger ? 'ON' : 'OFF'} />
        <Cell title="STOP Indicator" value={esp.stopIndicator ? 'ON' : 'OFF'} />
        <Cell title="Motion" value={motion.moving ? 'MOVING' : 'STABLE'} />
        <Cell title="ESP" value={esp.ok ? 'ONLINE' : 'OFFLINE'} />
      </View>
      <Pressable style={styles.btn} onPress={() => router.back()}><Text style={styles.btnText}>بازگشت</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#06080b', padding: 24, gap: 18 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: { width: '23%', minWidth: 150, backgroundColor: '#10151b', borderRadius: 16, padding: 18 },
  label: { color: '#8b95a5', fontSize: 13 },
  value: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 10 },
  btn: { marginTop: 10, backgroundColor: '#1d2630', padding: 14, borderRadius: 12 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '800' },
});
