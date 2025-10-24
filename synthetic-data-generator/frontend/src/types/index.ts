// User types
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Dataset types
export interface Dataset {
  id: string;
  name: string;
  prompt: string;
  data: DataRecord[];
  created_at?: string;
  updated_at?: string;
}

export interface DataRecord {
  id: number;
  [key: string]: any;
}

// API request types
export interface GenerateDataRequest {
  prompt: string;
  count: number;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Component props types
export interface DataTableProps {
  data: DataRecord[];
  onDataChange: (data: DataRecord[]) => void;
  onExport: (format: 'csv' | 'json') => void;
}

export interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: LoginRequest | RegisterRequest) => void;
  loading?: boolean;
  error?: string;
}

// API response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}
