export interface AdminUser {
  id: number;
  name: string;
  email: string;
  contact?: string;
  role: string;
}

export interface AdminAuthResponse {
  token: string;
  tokenType: string;
  user: AdminUser;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
