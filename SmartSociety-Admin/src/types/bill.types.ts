export type BillType = 
  | 'security_fee'
  | 'maintenance_fee'
  | 'water_charges'
  | 'electricity_charges'
  | 'misc';

export type BillStatus = 'pending' | 'paid' | 'overdue';

export interface Bill {
  id: string;
  userId: string;
  userName: string;
  houseNumber: string;
  type: BillType;
  amount: number;
  dueDate: Date;
  status: BillStatus;
  description: string;
  month: string; // "YYYY-MM" format
  createdAt: Date;
  paidAt?: Date;
  stripePaymentId?: string;
}