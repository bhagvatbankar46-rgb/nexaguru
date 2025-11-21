
export interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

export interface UserData {
  credits: number;
  isFirstLogin: boolean;
}

export interface User {
  email: string;
  password?: string; // In a real app, never store plain passwords. This is for simulation.
  credits: number;
  redeemedGift: boolean;
}

export const INITIAL_CREDITS = 20;
export const COST_PER_IMAGE = 1;
export const COST_PER_VIDEO = 5; // Premium video cost

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    price: 99,
    credits: 49,
    features: ['Standard Speed', 'Commercial Use', 'Priority Support']
  },
  {
    id: 'pro',
    name: 'Pro Bundle',
    price: 199,
    credits: 120,
    features: ['High Speed', 'Commercial Use', 'VIP Support', 'Exclusive Styles']
  }
];
