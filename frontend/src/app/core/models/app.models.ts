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
  subscriptionPlan?: 'monthly' | 'yearly' | null;
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'expired';
  subscriptionExpiresAt: string | null;
  subscriptionPaymentReference?: string | null;
  charityId: Charity | string | null;
  contributionPercentage: number;
  isActive?: boolean;
  activeScoresCount?: number;
  drawParticipationCount?: number;
  totalWinnings?: number;
}

export interface Score {
  _id: string;
  userId: string;
  value: number;
  usedInDrawId: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Draw {
  _id?: string;
  id?: string;
  numbers: number[];
  totalPool?: number;
  rolloverAmount?: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt?: string;
  drawDate?: string;
  completedAt: string | null;
}

export interface Winner {
  _id: string;
  userId: UserProfile | string;
  drawId: Draw | string;
  matchCount: number;
  payoutAmount: number;
  charityAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approvedAt?: string | null;
  rejectedAt?: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  plan: 'monthly' | 'yearly';
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  paymentReference: string;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  updatedAt?: string;
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
  totalSubscriptions: number;
  totalCharityContributions: number;
}
