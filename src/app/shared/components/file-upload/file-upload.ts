import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UploadedFile } from '../../models/uploaded-file.model';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
})
export class FileUploadComponent implements ControlValueAccessor, OnDestroy {
  maxSizeMB = input<number>(5);
  acceptTypes = input<string[]>(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
  disabled = input<boolean>(false);

  disabledSignal = signal<boolean>(false);
  files = signal<UploadedFile[]>([]);
  isDragging = signal<boolean>(false);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnDestroy(): void {
    this.cleanupObjectUrls();
  }

  private onChange: (file: UploadedFile[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(file: UploadedFile[]): void {
    this.cleanupObjectUrls();
    this.files.set(file ?? []);
  }

  registerOnChange(fn: (file: UploadedFile[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledSignal.set(isDisabled);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.handleFiles(Array.from(input.files));
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging.set(false);

    if (this.isDisabled()) return;

    const droppedFiles = event.dataTransfer?.files;
    if (!droppedFiles) return;

    this.handleFiles(Array.from(droppedFiles));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isDisabled()) {
      this.isDragging.set(true);
    }
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  openFileDialog() {
    if (!this.isDisabled()) {
      this.fileInput.nativeElement.click();
    }
  }

  removeFile(index: number) {
    const current = [...this.files()];
    const removed = current[index];

    if (removed.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }

    current.splice(index, 1);
    this.files.set(current);
    this.onChange(current);
  }

  private handleFiles(selectedFiles: File[]) {
    const processed: UploadedFile[] = [];

    for (const file of selectedFiles) {
      const error = this.validateFile(file);

      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

      processed.push({
        file,
        previewUrl,
        error: error ?? null,
      });
    }

    const updated = [...this.files(), ...processed];

    this.files.set(updated);
    this.onChange(updated);
    this.onTouched();
  }

  private validateFile(file: File): string | null {
    if (!this.acceptTypes().includes(file.type)) {
      return 'File type not allowed';
    }

    const maxBytes = this.maxSizeMB() * 1024 * 1024;

    if (file.size > maxBytes) {
      return `Max size ${this.maxSizeMB()}MB exceeded`;
    }

    return null;
  }

  private cleanupObjectUrls() {
    for (const file of this.files()) {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    }
  }

  isDisabled = computed<boolean>(() => this.disabled() || this.disabledSignal());
}
