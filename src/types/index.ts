// Tipos para la aplicación de Pilates

export interface Instructor {
  id: string;
  name: string;
  image?: string;
}

export interface ClassType {
  id: string;
  name: string;
  duration: number; // minutos
  description: string;
  color: string;
}

export interface ClassSession {
  id: string;
  classTypeId: string;
  instructorId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  maxCapacity: number;
  bookedCount: number;
  isFull: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  classSessionId: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'attended';
  classSession?: ClassSession;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  classCount: number;
  price: number;
  validityDays: number;
  isIntroOffer: boolean;
  isMonthly: boolean;
  isUnlimited: boolean;
  popular?: boolean;
}

export interface UserPackage {
  id: string;
  userId: string;
  packageId: string;
  purchaseDate: string;
  expiryDate: string;
  classesRemaining: number;
  classesUsed: number;
  isActive: boolean;
  package?: Package;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  credits: number;
  activePackages: UserPackage[];
}

export type View = 'home' | 'schedule' | 'packages' | 'my-bookings' | 'account';
