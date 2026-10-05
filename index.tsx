import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { usePhone1 } from '../src/state/Phone1Provider';

const fmt = (v: number | null, digits = 1) => (typeof v === 'number' ? v.toFixed(digits) : '--');

function Pill({ label, good }: { label: string; good: boolean }) {
  return (
    <View style={[styles.pill, good ? styles.pillGood : styles.pillBad]}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

export default function Dashboard() {
  const { gps, esp, motion, toggleCharger } = usePhone1();
  const speed = Math.max(0, (gps.speedMps ?? 0) * 3.6);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.top}>
        <View>
          <Text style={styles.brand}>HONDA</Text>
          <Text style={styles.sub}>MOTOR SMART • PHONE 1</Text>
        </View>
        <Pill label={esp.ok ? 'ESP ONLINE' : 'ESP OFFLINE'} good={esp.ok} />
      </View>

      <View style={styles.grid}>
        <View style={styles.hero}>
          <Text style={styles.label}>سرعت</Text>
          <Text style={styles.speed}>{fmt(speed, 0)}</Text>
          <Text style={styles.unit}>km/h</Text>
          <Text style={styles.small}>مسافت {Math.floor(gps.distanceMeters)} متر</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>دمای موتور</Text>
          <Text style={styles.value}>{fmt(esp.temperatureC)} °C</Text>
          <Text style={styles.small}>{esp.ignition ? 'سوئیچ روشن' : 'سوئیچ خاموش'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>نور</Text>
          <Text style={styles.value}>{esp.ldrNight ? 'شب' : 'روز'}</Text>
          <Text style={styles.small}>{esp.ldrNight ? 'چراغ کوچک باید فعال باشد' : 'حالت روز'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>FC-51</Text>
          <Text style={styles.value}>{esp.fc51 ? 'فعال' : 'آزاد'}</Text>
          <Text style={styles.small}>وضعیت ورودی سنسور</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>GPS</Text>
          <Text style={styles.value}>{gps.active ? 'فعال' : 'در انتظار'}</Text>
          <Text style={styles.small}>دقت {fmt(gps.accuracy, 0)} m</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>حرکت گوشی</Text>
          <Text style={styles.value}>{motion.moving ? 'حرکت' : 'ثابت'}</Text>
          <Text style={styles.small}>شدت {motion.magnitude.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>شارژر</Text>
          <Text style={styles.value}>{esp.charger ? 'روشن' : 'خاموش'}</Text>
          <Pressable
            style={[styles.button, esp.charger && styles.buttonOn]}
            onPress={() => toggleCharger(!esp.charger)}
          >
            <Text style={styles.buttonText}>{esp.charger ? 'خاموش کردن شارژر' : 'روشن کردن شارژر'}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.nav}>
        <Pressable style={styles.navBtn} onPress={() => router.push('/gps')}><Text style={styles.navTxt}>GPS</Text></Pressable>
        <Pressable style={styles.navBtn} onPress={() => router.push('/sensors')}><Text style={styles.navTxt}>سنسورها</Text></Pressable>
        <Pressable style={styles.navBtn} onPress={() => router.push('/camera')}><Text style={styles.navTxt}>دوربین</Text></Pressable>
        <Pressable style={styles.navBtn} onPress={() => router.push('/settings')}><Text style={styles.navTxt}>تنظیمات</Text></Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 18, gap: 14, backgroundColor: '#06080b', minHeight: '100%' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 5 },
  sub: { color: '#8b95a5', fontSize: 11, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  hero: { minWidth: 260, flexGrow: 2, flexBasis: '36%', backgroundColor: '#10151b', borderRadius: 20, padding: 18, minHeight: 185, justifyContent: 'center' },
  card: { minWidth: 190, flexGrow: 1, flexBasis: '22%', backgroundColor: '#10151b', borderRadius: 18, padding: 16, minHeight: 150 },
  label: { color: '#8b95a5', fontSize: 13 },
  speed: { color: '#fff', fontSize: 64, fontWeight: '900', lineHeight: 70 },
  unit: { color: '#cfd6df', fontSize: 16 },
  value: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 12 },
  small: { color: '#9ca6b5', marginTop: 8, fontSize: 12 },
  pill: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999 },
  pillGood: { backgroundColor: '#0e432d' },
  pillBad: { backgroundColor: '#4a2020' },
  pillText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  button: { marginTop: 16, backgroundColor: '#2f3742', padding: 12, borderRadius: 12 },
  buttonOn: { backgroundColor: '#245f43' },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  nav: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  navBtn: { flex: 1, minWidth: 140, backgroundColor: '#161d25', padding: 14, borderRadius: 14 },
  navTxt: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
