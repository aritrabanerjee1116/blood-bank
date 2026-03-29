// ─── Enums ───────────────────────────────────────────────────────
export type UserRole = 'admin' | 'donor' | 'hospital';

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export type UrgencyLevel = 'normal' | 'urgent' | 'emergency';

// ─── Database Models ─────────────────────────────────────────────
export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone: string;
  blood_group?: BloodGroup;
  location?: string;
  date_of_birth?: string;
  // Hospital-specific
  hospital_name?: string;
  license_number?: string;
  address?: string;
  contact_person?: string;
  // Status
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface BloodStock {
  id: string;
  blood_group: BloodGroup;
  units_available: number;
  expiry_date: string;
  collected_date: string;
  status: 'available' | 'reserved' | 'expired';
  donor_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BloodRequest {
  id: string;
  hospital_id: string;
  hospital_name?: string;
  blood_group: BloodGroup;
  units_requested: number;
  urgency: UrgencyLevel;
  status: RequestStatus;
  notes?: string;
  approved_by?: string;
  fulfilled_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  donor_id: string;
  donor_name?: string;
  scheduled_date: string;
  scheduled_time: string;
  location: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

// ─── UI Types ────────────────────────────────────────────────────
export interface StatsCardData {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
