export interface Link {
  code: string;
  originalUrl: string;
  createdAt: string; // ISO Date string
  clicks: number;
  lastClickedAt: string | null; // ISO Date string or null
}

export interface CreateLinkRequest {
  url: string;
  code?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface HealthStatus {
  ok: boolean;
  version: string;
  uptime: number;
  timestamp: string;
}