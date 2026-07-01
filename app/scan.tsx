import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, Stack } from 'expo-router';
import { parseOtpAuthUri } from '@/lib/totp';
import { addAccountFromSecret } from '@/lib/storage';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <>
        <Stack.Screen options={{ title: 'Scan QR' }} />
        <View style={styles.container}>
          <Text style={styles.help}>Camera access is required to scan OmniTender setup QR codes.</Text>
          <Pressable style={styles.btn} onPress={requestPermission}>
            <Text style={styles.btnText}>Allow camera</Text>
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Scan QR' }} />
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={locked ? undefined : async ({ data }) => {
            setLocked(true);
            try {
              const parsed = parseOtpAuthUri(data);
              await addAccountFromSecret(parsed);
              router.replace('/');
            } catch (err) {
              setLocked(false);
              Alert.alert('Invalid QR', err instanceof Error ? err.message : 'Not an otpauth:// TOTP URI');
            }
          }}
        />
        <Text style={styles.caption}>Point at the QR from omnitender.us staff setup</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  camera: { flex: 1 },
  caption: {
    color: '#e5e7eb',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#171a21',
  },
  help: { color: '#9ca3af', padding: 20, lineHeight: 20 },
  btn: {
    marginHorizontal: 20,
    backgroundColor: '#f7792c',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#000', fontWeight: '800' },
});
