import { ScrollView, Text, View } from 'react-native';

import { PrimaryButton, ProductSummary, Stars, screenStyles as s } from '../components';
import { strings } from '../i18n';
import type { SavedItem } from '../lib/types';

type Props = { item: SavedItem; onEdit: () => void; onDone: () => void };

export function ItemScreen({ item, onEdit, onDone }: Props) {
  const t = strings.item;
  return (
    <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={s.screen}>
      <ProductSummary product={item.product} />
      <Text style={[s.body, { marginBottom: 0 }]}>{t.title}</Text>
      <Stars value={item.note.rating} size={44} />
      <Text style={[s.body, { fontSize: 18, color: '#111' }]}>
        {item.note.comment || t.noComment}
      </Text>
      <PrimaryButton label={t.scanNext} onPress={onDone} />
      <View style={s.gap} />
      <PrimaryButton label={t.edit} onPress={onEdit} secondary />
    </ScrollView>
  );
}
