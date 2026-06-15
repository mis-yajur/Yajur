export type Role = 'admin' | 'store' | 'hr' | 'production' | 'pms' | 'sales' | 'office';

export type ThemePlate = 'slate' | 'midnight' | 'emerald' | 'amethyst' | 'rose' | 'ocean';

export interface User {
  username: string;
  role: Role;
  allowedModules?: string[];
}

export interface UserCredential {
  username: string;
  pass: string;
  role: Role;
  allowedModules: string[];
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  url?: string;
  badge?: string;
  description?: string;
  pinned?: boolean;
  items?: SubModule[];
}

export interface SubModule {
  id: string;
  title: string;
  url: string;
}

export interface SalesData {
  total: number;
  target: number;
  growth: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  done: number;
}

export interface RecentActivity {
  id: string;
  username: string;
  role: Role;
  action: string;
  moduleName?: string;
  timestamp: string; // ISO string
}

