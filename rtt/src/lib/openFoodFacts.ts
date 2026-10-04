import type { Product } from './types';

const FIELDS = 'product_name,brands,quantity,image_front_small_url';
const TIMEOUT_MS = 10000;

// Returns null when the barcode is unknown; throws when the network fails.
export async function lookupProduct(barcode: string): Promise<Product | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=${FIELDS}`,
      {
        headers: { 'User-Agent': 'RememberThatThing/0.1 (mobile app prototype)' },
        signal: controller.signal,
      },
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Open Food Facts: HTTP ${response.status}`);
    const json = (await response.json()) as {
      status?: number;
      product?: {
        product_name?: string;
        brands?: string;
        quantity?: string;
        image_front_small_url?: string;
      };
    };
    const p = json.product;
    if (json.status !== 1 || !p?.product_name?.trim()) return null;
    return {
      barcode,
      name: p.product_name.trim(),
      brand: (p.brands ?? '').split(',')[0].trim(),
      quantity: (p.quantity ?? '').trim(),
      imageUrl: p.image_front_small_url ?? null,
    };
  } finally {
    clearTimeout(timer);
  }
}
