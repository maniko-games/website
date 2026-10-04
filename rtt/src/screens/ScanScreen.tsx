import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useCallback, useRef } from 'react';
import { Linking, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

import { strings } from '../i18n';
import { isValidEan13 } from '../lib/barcode';

const BARCODE_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e'] as const;

type Props = { onCode: (code: string) => void };

export function ScanScreen({ onCode }: Props) {
  const t = strings.scan;
  const [permission, requestPermission] = useCameraPermissions();
  const handled = useRef(false);

  const onScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (handled.current) return;
      // A misread EAN-13 fails its check digit; keep scanning instead of reporting it.
      if (result.type === 'ean13' && !isValidEan13(result.data)) return;
      handled.current = true;
      Vibration.vibrate(50);
      onCode(result.data);
    },
    [onCode],
  );

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
        onBarcodeScanned={onScanned}
      />
      <View style={styles.hintWrap} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.hint}>{t.hint}</Text>
      </View>
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
});
