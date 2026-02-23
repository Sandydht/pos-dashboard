import { UploadContext } from './upload-context.model';

export interface UploadRequest {
  file: File;
  context: UploadContext;
  entityId: string;
}
