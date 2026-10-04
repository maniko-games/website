import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
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

  const scrollRef = useRef<ScrollView>(null);
  const commentY = useRef(0);
  const commentFocused = useRef(false);
  const dragging = useRef(false);
  const lastOffset = useRef(0);

  // Park the comment field near the top of the visible area so there is room above the keyboard.
  const scrollToComment = () =>
    scrollRef.current?.scrollTo({ y: Math.max(0, commentY.current - 140), animated: true });

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      if (commentFocused.current) scrollToComment();
    });
    return () => sub.remove();
  }, []);

  // Like Google Messages: dragging the content down (towards the top) hides the keyboard,
  // dragging it up keeps the keyboard visible.
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    if (dragging.current && y < lastOffset.current - 4) Keyboard.dismiss();
    lastOffset.current = y;
  };

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
      behavior="padding"
    >
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => (dragging.current = true)}
        onScrollEndDrag={() => (dragging.current = false)}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {notFound && <Text style={[s.body, styles.notice]}>{t.notFound}</Text>}
        <Text style={styles.label}>{t.name}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>{t.brand}</Text>
        <TextInput style={styles.input} value={brand} onChangeText={setBrand} />
        <Text style={styles.label}>{t.quantity}</Text>
        <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} />
        <Text style={styles.label}>{t.rating}</Text>
        <Stars value={rating} onChange={setRating} />
        <Text style={styles.label} onLayout={(e) => (commentY.current = e.nativeEvent.layout.y)}>
          {t.comment}
        </Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          onFocus={() => {
            commentFocused.current = true;
            setTimeout(scrollToComment, 100);
          }}
          onBlur={() => (commentFocused.current = false)}
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
  content: { padding: 24, paddingTop: 64, paddingBottom: 320 },
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
