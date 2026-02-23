export interface Product {
  id: string;
  outletId: string;
  categoryId: string | null;
  photoUrl: string | null;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
