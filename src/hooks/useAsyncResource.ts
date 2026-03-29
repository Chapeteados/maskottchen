import { useEffect, useState, type DependencyList } from "react";

export type AsyncResourceState<T> = {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
};

/**
 * Ejecuta un `fetcher` al montar (y cuando cambian `deps`).
 * Evita actualizar estado si el componente se desmontó (`cancelled`).
 * Pasa funciones importadas estables (`getSlides`, …) o memoriza el `fetcher` con `useCallback`.
 */
export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList = [],
): AsyncResourceState<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(undefined);

    (async () => {
      try {
        const result = await fetcher();
        if (!cancelled) {
          setData(result);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetcher, ...deps]);

  return { data, loading, error };
}
