import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { PrimaryButton, Stars, screenStyles as s } from '../components';
import { strings } from '../i18n';
import type { Product, SavedItem, UserNote } from '../lib/types';

type Props = {
  product: Product;
  note: UserNote | null;
  notFound: boolean;
  onSave: (item: SavedItem) => void;
  onCancel: () => void;
};

export function FormScreen({ product, note, notFound, onSave, onCancel }: Props) {
  const t = strings.form;
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand);
  const [quantity, setQuantity] = useState(product.quantity);
  const [rating, setRating] = useState(note?.rating ?? 0);
  const [comment, setComment] = useState(note?.comment ?? '');

  const save = () => {
    if (!name.trim()) return Alert.alert(t.nameRequired);
    if (rating === 0) return Alert.alert(t.ratingRequired);
    onSave({
      product: { ...product, name: name.trim(), brand: brand.trim(), quantity: quantity.trim() },
      note: { rating, comment: comment.trim(), updatedAt: Date.now() },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {notFound && <Text style={[s.body, styles.notice]}>{t.notFound}</Text>}
        <Text style={styles.label}>{t.name}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>{t.brand}</Text>
        <TextInput style={styles.input} value={brand} onChangeText={setBrand} />
        <Text style={styles.label}>{t.quantity}</Text>
        <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} />
        <Text style={styles.label}>{t.rating}</Text>
        <Stars value={rating} onChange={setRating} />
        <Text style={styles.label}>{t.comment}</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={comment}
          onChangeText={setComment}
          placeholder={t.commentPlaceholder}
          multiline
        />
        <View style={s.gap} />
        <PrimaryButton label={t.save} onPress={save} />
        <View style={s.gap} />
        <PrimaryButton label={t.cancel} onPress={onCancel} secondary />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 64 },
  notice: { textAlign: 'left', backgroundColor: '#fef3c7', padding: 12, borderRadius: 8 },
  label: { fontSize: 14, color: '#555', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
});
