export interface User {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  houseNumber: string;
  cnic: string;
  isActive: boolean;
  isApproved: boolean;
  role: 'resident';
  createdAt: Date;
  updatedAt: Date;
  fcmToken?: string;
}