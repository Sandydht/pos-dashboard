import { OpeningHours } from './opening-hours.model';

export interface Outlet {
  id: string;
  storeId: string;
  code: string;
  name: string;
  phoneNumber: string;
  email: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  isActive: boolean;
  openingHours: OpeningHours;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
