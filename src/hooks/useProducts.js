import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/productService';

export function useProducts(initialParams = {}) {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [params, setParams]         = useState({ page: 1, limit: 12, ...initialParams });

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(params);
      setProducts(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, loading, error, total, totalPages, params, setParams, refetch: fetch };
}
