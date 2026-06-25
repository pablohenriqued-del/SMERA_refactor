import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import api, { apiErrorMessage } from '../lib/api';

export function useCrud(endpoint, resourceName = 'Registro') {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(endpoint);
      setItems(data);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = async (payload) => {
    try {
      const { data } = await api.post(endpoint, payload);
      setItems((prev) => [...prev, data]);
      toast.success(`${resourceName} criado com sucesso`);
      return data;
    } catch (err) {
      toast.error(apiErrorMessage(err));
      throw err;
    }
  };

  const update = async (id, payload) => {
    try {
      const { data } = await api.put(`${endpoint}/${id}`, payload);
      setItems((prev) => prev.map((i) => (i.id === id ? data : i)));
      toast.success(`${resourceName} atualizado com sucesso`);
      return data;
    } catch (err) {
      toast.error(apiErrorMessage(err));
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(`${resourceName} excluído com sucesso`);
    } catch (err) {
      toast.error(apiErrorMessage(err));
      throw err;
    }
  };

  return { items, loading, refetch, create, update, remove };
}
