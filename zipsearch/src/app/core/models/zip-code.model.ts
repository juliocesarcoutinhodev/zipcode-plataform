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
