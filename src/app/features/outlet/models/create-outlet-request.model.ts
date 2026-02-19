import { OpeningHours } from './opening-hours.model';

export interface CreateOutletRequest {
  name: string;
  code: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  openingHours: OpeningHours;
}
