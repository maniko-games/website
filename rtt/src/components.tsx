import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Product } from './lib/types';

export function PrimaryButton(props: { label: string; onPress: () => void; secondary?: boolean }) {
  return (
    <Pressable
      style={[styles.button, props.secondary && styles.buttonSecondary]}
      onPress={props.onPress}
    >
      <Text style={[styles.buttonText, props.secondary && styles.buttonTextSecondary]}>
        {props.label}
      </Text>
    </Pressable>
  );
}

export function Stars(props: { value: number; onChange?: (value: number) => void; size?: number }) {
  const size = props.size ?? 40;
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} disabled={!props.onChange} onPress={() => props.onChange?.(n)}>
          <Text style={{ fontSize: size, color: n <= props.value ? '#f59e0b' : '#d1d5db' }}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function ProductSummary({ product }: { product: Product }) {
  return (
    <View style={styles.summary}>
      {product.imageUrl ? (
        <Image source={{ uri: product.imageUrl }} style={styles.photo} resizeMode="contain" />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]} />
      )}
      <Text style={styles.name}>{product.name}</Text>
      {product.brand ? <Text style={styles.meta}>{product.brand}</Text> : null}
      {product.quantity ? <Text style={styles.meta}>{product.quantity}</Text> : null}
    </View>
  );
}

export const screenStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 64 },
  centered: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  body: { fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 20 },
  gap: { height: 12 },
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSecondary: { backgroundColor: '#e5e7eb' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonTextSecondary: { color: '#111' },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 8 },
  summary: { alignItems: 'center', marginBottom: 16 },
  photo: { width: 180, height: 180, marginBottom: 12 },
  photoPlaceholder: { backgroundColor: '#f3f4f6', borderRadius: 12 },
  name: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  meta: { fontSize: 16, color: '#555', marginTop: 4, textAlign: 'center' },
});
