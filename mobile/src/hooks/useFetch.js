import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Pequeno equivalente ao useFetch da versão web.
 * Recarrega sempre que a tela ganha foco (volta de outra aba, por exemplo).
 */
export function useFetch(fetcher) {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dataRef = useRef(null);
  dataRef.current = data;

  const load = useCallback(async () => {
    setError(null);
    if (dataRef.current == null) setLoading(true);

    try {
      const result = await fetcherRef.current();
      setData(result ?? null);
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e?.message ||
          'Não foi possível carregar os dados.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { data, loading, error, reload: load, setData };
}

export default useFetch;
