import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly secretKey = environment.storageSecret;

  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  private decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  set<T>(key: string, data: T): void {
    const json = JSON.stringify(data);
    const encrypted = this.encrypt(json);

    localStorage.setItem(key, encrypted);
  }

  get<T>(key: string): T | null {
    const encrypted = localStorage.getItem(key);

    if (!encrypted) return null;

    try {
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted) as T;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
