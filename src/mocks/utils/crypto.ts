import CryptoJS from 'crypto-js';

const secretKey: string = 'secret-key';

export const encrypt = (value: string): string => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};

export const decrypt = (value: string): string => {
  const bytes = CryptoJS.AES.decrypt(value, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
