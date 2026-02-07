export type ComplaintCategory = 
  | 'electricity'
  | 'water_supply'
  | 'gas_supply'
  | 'sewerage'
  | 'security'
  | 'maintenance'
  | 'cleanliness'
  | 'noise';

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  houseNumber: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  status: ComplaintStatus;
  createdAt: Date;
  updatedAt: Date;
  adminReply?: string;
  repliedAt?: Date;
  resolvedAt?: Date;
  imageUrls?: string[];
}

export interface Suggestion {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  houseNumber: string;
  title: string;
  description: string;
  status: 'pending' | 'reviewed';
  createdAt: Date;
  updatedAt: Date;
  adminReply?: string;
  repliedAt?: Date;
  reviewedAt?: Date;
}

export const ComplaintCategories: Record<ComplaintCategory, { label: string; icon: string; description: string }> = {
  electricity: {
    label: 'Electricity',
    icon: 'flash',
    description: 'Power outage, voltage issues, meter problems'
  },
  water_supply: {
    label: 'Water Supply',
    icon: 'water',
    description: 'Water shortage, low pressure, quality issues'
  },
  gas_supply: {
    label: 'Gas Supply',
    icon: 'flame',
    description: 'Gas leakage, low pressure, supply issues'
  },
  sewerage: {
    label: 'Sewerage',
    icon: 'options',
    description: 'Drainage blockage, overflow, pipe issues'
  },
  security: {
    label: 'Security',
    icon: 'shield-checkmark',
    description: 'Guard issues, gate problems, safety concerns'
  },
  maintenance: {
    label: 'Maintenance',
    icon: 'construct',
    description: 'Repairs, infrastructure, common area issues'
  },
  cleanliness: {
    label: 'Cleanliness',
    icon: 'trash',
    description: 'Garbage collection, sanitation issues'
  },
  noise: {
    label: 'Noise Pollution',
    icon: 'volume-high',
    description: 'Excessive noise, disturbance issues'
  },
};