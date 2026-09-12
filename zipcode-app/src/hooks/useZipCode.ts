import { useCallback, useState } from 'react';

import { fetchZipCode, ApiRequestError } from '@/services/api';
import { ApiError, ZipCode } from '@/types/zip-code';

export type SearchState = 'idle' | 'loading' | 'result' | 'error';

interface UseZipCodeResult {
  state: SearchState;
  result: ZipCode | null;
  error: ApiError | null;
  search: (code: string) => void;
  newSearch: () => void;
}

export function useZipCode(): UseZipCodeResult {
  const [state, setState] = useState<SearchState>('idle');
  const [result, setResult] = useState<ZipCode | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const search = useCallback((code: string) => {
    setState('loading');
    setResult(null);
    setError(null);

    fetchZipCode(code)
      .then((data) => {
        setResult(data);
        setState('result');
      })
      .catch((err: unknown) => {
        if (err instanceof ApiRequestError) {
          setError(err.apiError);
        } else {
          setError({
            status: 503,
            error: 'Serviço indisponível',
            message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
            timestamp: new Date().toISOString(),
            path: `/api/v1/zip/${code}`,
          });
        }
        setState('error');
      });
  }, []);

  const newSearch = useCallback(() => {
    setState('idle');
    setResult(null);
    setError(null);
  }, []);

  return { state, result, error, search, newSearch };
}
