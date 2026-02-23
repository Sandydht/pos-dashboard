export interface UploadResponse {
  id: string;
  url: string;
  context: string;
  entityId: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
