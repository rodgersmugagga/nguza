import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export default function useURLSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }, [searchParams]);

  const setFilter = (key, value) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value === null || value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }

      // Reset page to 1 when any filter other than page changes
      if (key !== 'page') {
        newParams.set('page', '1');
      }

      return newParams;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return { filters, setFilter, clearFilters, searchParams };
}
