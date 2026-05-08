export type Role = 'admin' | 'store' | 'hr' | 'production' | 'pms' | 'sales' | 'office';

export interface User {
  username: string;
  role: Role;
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  url?: string;
  badge?: string;
  description?: string;
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
