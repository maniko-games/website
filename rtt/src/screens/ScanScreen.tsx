import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useCallback, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

import { strings } from '../i18n';
import { isValidEan13 } from '../lib/barcode';

const BARCODE_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'qr'] as const;

type Scan = { data: string; type: string };

export function ScanScreen() {
  const t = strings.scan;
  const [permission, requestPermission] = useCameraPermissions();
  const [scan, setScan] = useState<Scan | null>(null);

  const onScanned = useCallback((result: BarcodeScanningResult) => {
    // Keep only the first hit; the camera keeps firing until we unmount the listener.
    setScan((current) => {
      if (current) return current;
      Vibration.vibrate(50);
      return { data: result.data, type: result.type };
    });
  }, []);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.title}>{t.permissionTitle}</Text>
        <Text style={styles.body}>
          {permission.canAskAgain ? t.permissionBody : t.permissionDenied}
        </Text>
        <Pressable
          style={styles.button}
          onPress={permission.canAskAgain ? requestPermission : Linking.openSettings}
        >
          <Text style={styles.buttonText}>
            {permission.canAskAgain ? t.permissionButton : t.openSettings}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: [...BARCODE_TYPES] }}
        onBarcodeScanned={scan ? undefined : onScanned}
      />
      {!scan && (
        <View style={styles.hintWrap} pointerEvents="none">
          <View style={styles.frame} />
          <Text style={styles.hint}>{t.hint}</Text>
        </View>
      )}
      {scan && (
        <View style={styles.resultCard}>
          <Text style={styles.label}>{t.resultLabel}</Text>
          <Text style={styles.code} selectable>
            {scan.data}
          </Text>
          <Text style={styles.meta}>
            {t.typeLabel}: {scan.type}
          </Text>
          {scan.type === 'ean13' && (
            <Text style={styles.meta}>
              {isValidEan13(scan.data) ? t.checksumValid : t.checksumInvalid}
            </Text>
          )}
          <Pressable style={styles.button} onPress={() => setScan(null)}>
            <Text style={styles.buttonText}>{t.scanAgain}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 16, textAlign: 'center', marginBottom: 24, color: '#444' },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  hintWrap: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: 280,
    height: 160,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
  },
  hint: { color: '#fff', fontSize: 16 },
  resultCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 48,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  label: { fontSize: 14, color: '#666' },
  code: { fontSize: 32, fontWeight: '700', marginVertical: 6 },
  meta: { fontSize: 14, color: '#444' },
});
