import Constants from 'expo-constants';

import { ApiError, ZipCode } from '@/types/zip-code';

const API_BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl as string) || 'http://10.0.2.2:8080/api/v1';

export class ApiRequestError extends Error {
  constructor(
    public statusCode: number,
    public apiError: ApiError,
  ) {
    super(apiError.message);
    this.name = 'ApiRequestError';
  }
}

export async function fetchZipCode(code: string): Promise<ZipCode> {
  const normalized = code.replace(/\D/g, '');

  const response = await fetch(`${API_BASE_URL}/zip/${normalized}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    let apiError: ApiError;

    try {
      apiError = await response.json();
    } catch {
      apiError = {
        status: response.status,
        error: 'Erro de conexão',
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
        timestamp: new Date().toISOString(),
        path: `/api/v1/zip/${normalized}`,
      };
    }

    throw new ApiRequestError(response.status, apiError);
  }

  return response.json();
}
