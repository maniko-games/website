import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';

import { lookupProduct } from './src/lib/openFoodFacts';
import { loadItem, saveItem } from './src/lib/storage';
import type { Product, SavedItem } from './src/lib/types';
import { ConfirmScreen } from './src/screens/ConfirmScreen';
import { FormScreen } from './src/screens/FormScreen';
import { ItemScreen } from './src/screens/ItemScreen';
import { LookupScreen } from './src/screens/LookupScreen';
import { ScanScreen } from './src/screens/ScanScreen';

type Route =
  | { name: 'scan' }
  | { name: 'lookup'; code: string; failed: boolean }
  | { name: 'confirm'; product: Product }
  | { name: 'form'; product: Product; item: SavedItem | null; notFound: boolean }
  | { name: 'item'; item: SavedItem };

const emptyProduct = (barcode: string): Product => ({
  barcode,
  name: '',
  brand: '',
  quantity: '',
  imageUrl: null,
});

export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'scan' });

  const handleCode = useCallback(async (code: string) => {
    setRoute({ name: 'lookup', code, failed: false });
    try {
      // Already in the user's own list: show their rating right away.
      const saved = await loadItem(code);
      if (saved) return setRoute({ name: 'item', item: saved });
      const product = await lookupProduct(code);
      if (product) setRoute({ name: 'confirm', product });
      else setRoute({ name: 'form', product: emptyProduct(code), item: null, notFound: true });
    } catch {
      setRoute({ name: 'lookup', code, failed: true });
    }
  }, []);

  const toScan = () => setRoute({ name: 'scan' });

  const screen = (() => {
    switch (route.name) {
      case 'scan':
        return <ScanScreen onCode={handleCode} />;
      case 'lookup':
        return (
          <LookupScreen
            failed={route.failed}
            onRetry={() => handleCode(route.code)}
            onManual={() =>
              setRoute({ name: 'form', product: emptyProduct(route.code), item: null, notFound: false })
            }
            onCancel={toScan}
          />
        );
      case 'confirm':
        return (
          <ConfirmScreen
            product={route.product}
            onYes={() =>
              setRoute({ name: 'form', product: route.product, item: null, notFound: false })
            }
            onNo={() =>
              setRoute({
                name: 'form',
                product: emptyProduct(route.product.barcode),
                item: null,
                notFound: false,
              })
            }
          />
        );
      case 'form':
        return (
          <FormScreen
            product={route.product}
            note={route.item?.note ?? null}
            notFound={route.notFound}
            onSave={async (item) => {
              await saveItem(item);
              setRoute({ name: 'item', item });
            }}
            onCancel={toScan}
          />
        );
      case 'item':
        return (
          <ItemScreen
            item={route.item}
            onEdit={() =>
              setRoute({ name: 'form', product: route.item.product, item: route.item, notFound: false })
            }
            onDone={toScan}
          />
        );
    }
  })();

  return (
    <>
      {screen}
      <StatusBar style="auto" />
    </>
  );
}
