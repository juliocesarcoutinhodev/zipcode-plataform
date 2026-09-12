export interface ZipCode {
  code: string;
  street: string | null;
  number: string | null;
  district: string | null;
  city: string;
  state: string;
  municipality: number;
  updated: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}
