import { OpeningHours } from './opening-hours.model';

export interface Outlet {
  id: string;
  storeId: string;
  code: string;
  name: string;
  phoneNumber: string;
  email: string;
  countryId: string;
  provinceId: string;
  cityId: string;
  postalCode: string;
  address: string;
  isActive: boolean;
  openingHours: OpeningHours;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
