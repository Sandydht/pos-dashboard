import { UploadContext } from './upload-context.model';

export interface UploadedFileEntity {
  id: string;

  context: UploadContext;
  entityId: string | null;

  name: string;
  type: string;

  blob: Blob;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
