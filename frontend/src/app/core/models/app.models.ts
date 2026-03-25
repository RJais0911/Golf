export interface Charity {
  _id: string;
  name: string;
  description: string;
}

export interface UserProfile {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  subscriptionExpiresAt: string | null;
  charityId: Charity | string | null;
  contributionPercentage: number;
  isActive?: boolean;
}

export interface Score {
  _id: string;
  userId: string;
  value: number;
  usedInDrawId: string | null;
  createdAt: string;
}

export interface Draw {
  _id?: string;
  id?: string;
  numbers: number[];
  status: 'pending' | 'completed' | 'cancelled';
  createdAt?: string;
  completedAt: string | null;
}

export interface Winner {
  _id: string;
  userId: UserProfile | string;
  drawId: Draw | string;
  matchCount: number;
  prizeAmount: number;
  charityAmount: number;
  status: 'pending' | 'paid';
  paidAt: string | null;
  createdAt: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  plan: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
}

export interface CharityContribution {
  _id: string;
  userId: UserProfile | string;
  charityId: Charity | string;
  amount: number;
  source: 'subscription' | 'winning';
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalDraws: number;
  totalWinners: number;
  totalCharityContributions: number;
}
