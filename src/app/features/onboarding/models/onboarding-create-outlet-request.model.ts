import { OpeningHours } from '../../outlet/models/opening-hours.model';

export interface OnboardingCreateOutletRequest {
  code: string;
  name: string;
  phoneNumber: string;
  email: string;
  countryId: string;
  provinceId: string;
  cityId: string;
  postalCode: string;
  address: string;
  openingHours: OpeningHours;
}
