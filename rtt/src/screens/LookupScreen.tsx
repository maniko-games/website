import { ActivityIndicator, Text, View } from 'react-native';

import { PrimaryButton, screenStyles as s } from '../components';
import { strings } from '../i18n';

type Props = {
  failed: boolean;
  onRetry: () => void;
  onManual: () => void;
  onCancel: () => void;
};

export function LookupScreen({ failed, onRetry, onManual, onCancel }: Props) {
  const t = strings.lookup;
  if (!failed) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" />
        <Text style={[s.body, { marginTop: 16 }]}>{t.searching}</Text>
      </View>
    );
  }
  return (
    <View style={s.centered}>
      <Text style={s.body}>{t.networkError}</Text>
      <PrimaryButton label={t.retry} onPress={onRetry} />
      <View style={s.gap} />
      <PrimaryButton label={t.enterManually} onPress={onManual} secondary />
      <View style={s.gap} />
      <PrimaryButton label={t.cancel} onPress={onCancel} secondary />
    </View>
  );
}
