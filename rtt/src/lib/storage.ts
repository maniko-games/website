import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Product, SavedItem, UserNote } from './types';

const PRODUCTS_KEY = 'rtt.products';
const NOTES_KEY = 'rtt.notes';

async function readMap<T>(key: string): Promise<Record<string, T>> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as Record<string, T>) : {};
}

async function writeEntry<T>(key: string, barcode: string, value: T): Promise<void> {
  const map = await readMap<T>(key);
  map[barcode] = value;
  await AsyncStorage.setItem(key, JSON.stringify(map));
}

export async function loadItem(barcode: string): Promise<SavedItem | null> {
  const [products, notes] = await Promise.all([
    readMap<Product>(PRODUCTS_KEY),
    readMap<UserNote>(NOTES_KEY),
  ]);
  const product = products[barcode];
  const note = notes[barcode];
  return product && note ? { product, note } : null;
}

export async function saveItem(item: SavedItem): Promise<void> {
  await writeEntry(PRODUCTS_KEY, item.product.barcode, item.product);
  await writeEntry(NOTES_KEY, item.product.barcode, item.note);
}
