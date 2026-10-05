import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { router } from 'expo-router';

export default function CameraScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastUri, setLastUri] = useState<string | null>(null);
  const [lastType, setLastType] = useState<'photo' | 'video' | null>(null);

  if (!cameraPermission || !microphonePermission) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>برای استفاده از دوربین باید مجوز دوربین را بدهی.</Text>
        <Pressable style={styles.btn} onPress={() => requestCameraPermission()}>
          <Text style={styles.btnText}>اجازه دوربین</Text>
        </Pressable>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current || busy || recording) return;
    try {
      setBusy(true);
      const result = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (result?.uri) { setLastUri(result.uri); setLastType('photo'); }
    } catch {
      Alert.alert('دوربین', 'گرفتن عکس ناموفق بود.');
    } finally {
      setBusy(false);
    }
  };

  const toggleVideo = async () => {
    if (!cameraRef.current || busy) return;
    if (recording) {
      cameraRef.current.stopRecording();
      setRecording(false);
      return;
    }
    if (!microphonePermission.granted) {
      const result = await requestMicrophonePermission();
      if (!result.granted) {
        Alert.alert('میکروفون', 'برای ضبط ویدیو اجازه میکروفون لازم است.');
        return;
      }
    }
    try {
      setRecording(true);
      const result = await cameraRef.current.recordAsync({ maxDuration: 120 });
      if (result?.uri) { setLastUri(result.uri); setLastType('video'); }
    } catch {
      Alert.alert('دوربین', 'ضبط ویدیو ناموفق بود.');
    } finally {
      setRecording(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.cameraWrap}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
        <View style={styles.overlay}>
          <View style={styles.topRow}>
            <Text style={styles.badge}>CAM {facing === 'back' ? 'BACK' : 'FRONT'}</Text>
            <Pressable style={styles.smallBtn} onPress={() => setFacing(v => (v === 'back' ? 'front' : 'back'))}>
              <Text style={styles.smallBtnText}>تعویض دوربین</Text>
            </Pressable>
          </View>
          <View style={styles.bottomRow}>
            <Pressable disabled={recording || busy} style={styles.btn} onPress={takePhoto}>
              <Text style={styles.btnText}>{busy ? '...' : '📷 عکس'}</Text>
            </Pressable>
            <Pressable style={[styles.btn, recording && styles.recording]} onPress={toggleVideo}>
              <Text style={styles.btnText}>{recording ? '⏹ توقف' : '🎥 فیلم'}</Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={() => router.back()}>
              <Text style={styles.btnText}>بازگشت</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {lastUri ? (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>{lastType === 'video' ? 'آخرین ویدیو' : 'آخرین عکس'}</Text>
          {lastType === 'photo' ? (
            <Image source={{ uri: lastUri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <View style={styles.videoPreview}>
              <Text style={styles.videoIcon}>🎥</Text>
              <Text style={styles.videoText}>ویدیو آماده است</Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#050608', padding: 12 },
  cameraWrap: { flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 14 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bottomRow: { flexDirection: 'row', gap: 10 },
  badge: { color: '#fff', backgroundColor: '#111820cc', padding: 10, borderRadius: 10, fontWeight: '800' },
  smallBtn: { backgroundColor: '#111820cc', padding: 10, borderRadius: 10 },
  smallBtnText: { color: '#fff', fontWeight: '800' },
  btn: { backgroundColor: '#151d26e8', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 18, flex: 1 },
  recording: { backgroundColor: '#77252d' },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '800' },
  preview: { position: 'absolute', right: 20, bottom: 20, width: 150, height: 100, backgroundColor: '#10151b', borderRadius: 12, padding: 8 },
  previewTitle: { color: '#fff', fontSize: 11, marginBottom: 5 },
  previewImage: { width: '100%', height: 70, borderRadius: 8 },
  videoPreview: { width: '100%', height: 70, borderRadius: 8, backgroundColor: '#050608', justifyContent: 'center', alignItems: 'center' },
  videoIcon: { fontSize: 24 },
  videoText: { color: '#d9e1eb', fontSize: 10, marginTop: 2 },
  center: { flex: 1, backgroundColor: '#06080b', justifyContent: 'center', alignItems: 'center', gap: 16, padding: 24 },
  permissionText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});
