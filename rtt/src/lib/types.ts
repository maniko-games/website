// Shared product card (same for everyone) and the user's personal layer are separate records.
export type Product = {
  barcode: string;
  name: string;
  brand: string;
  quantity: string;
  imageUrl: string | null;
};

export type UserNote = {
  rating: number;
  comment: string;
  updatedAt: number;
};

export type SavedItem = { product: Product; note: UserNote };
