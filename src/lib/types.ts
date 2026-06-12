export interface LinkData {
  id: string;
  slug: string;
  originalUrl: string;
  title: string | null;
  password: string | null;
  expiresAt: string | null;
  clicks: number;
  lastAccessed: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLinkInput {
  originalUrl: string;
  slug?: string;
  title?: string;
  password?: string;
  expiresAt?: string;
}

export interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
  topLinks: LinkData[];
  recentLinks: LinkData[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
