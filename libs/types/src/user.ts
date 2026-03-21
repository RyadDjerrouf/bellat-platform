import { UserRole } from './enums';

export interface UserProfile {
  id:          string;
  fullName:    string;
  email:       string;
  phoneNumber: string | null;
  role:        UserRole;
  createdAt:   string;
}
