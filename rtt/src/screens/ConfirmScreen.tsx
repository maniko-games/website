import { Text, View } from 'react-native';

import { PrimaryButton, ProductSummary, screenStyles as s } from '../components';
import { strings } from '../i18n';
import type { Product } from '../lib/types';

type Props = { product: Product; onYes: () => void; onNo: () => void };

export function ConfirmScreen({ product, onYes, onNo }: Props) {
  const t = strings.confirm;
  return (
    <View style={s.screen}>
      <Text style={s.title}>{t.title}</Text>
      <ProductSummary product={product} />
      <PrimaryButton label={t.yes} onPress={onYes} />
      <View style={s.gap} />
      <PrimaryButton label={t.no} onPress={onNo} secondary />
      <Text style={[s.body, { marginTop: 24, fontSize: 12 }]}>{t.source}</Text>
    </View>
  );
}
