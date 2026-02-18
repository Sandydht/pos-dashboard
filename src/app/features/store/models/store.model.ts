export interface Store {
  id: string;
  photoUrl: string | null;
  code: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
