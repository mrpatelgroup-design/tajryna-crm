import { useState, useCallback } from 'react';

export function useCrud<T extends { id: string }>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const add = useCallback((item: T) => {
    setData((prev) => [item, ...prev]);
    setShowAdd(false);
  }, []);

  const update = useCallback((item: T) => {
    setData((prev) => prev.map((d) => (d.id === item.id ? item : d)));
    setShowEdit(false);
    setEditItem(null);
  }, []);

  const remove = useCallback(() => {
    if (deleteId) {
      setData((prev) => prev.filter((d) => d.id !== deleteId));
      setDeleteId(null);
      setShowDelete(false);
    }
  }, [deleteId]);

  const openEdit = useCallback((item: T) => {
    setEditItem(item);
    setShowEdit(true);
  }, []);

  const openDelete = useCallback((id: string) => {
    setDeleteId(id);
    setShowDelete(true);
  }, []);

  const nextId = useCallback((prefix: string) => {
    const nums = data.map((d) => {
      const m = d.id.match(/(\d+)$/);
      return m ? parseInt(m[1], 10) : 0;
    });
    const max = nums.length > 0 ? Math.max(...nums) : 0;
    return `${prefix}${String(max + 1).padStart(3, '0')}`;
  }, [data]);

  return {
    data, setData,
    editItem, setEditItem,
    showAdd, setShowAdd,
    showEdit, setShowEdit,
    showDelete, setShowDelete,
    deleteId,
    add, update, remove,
    openEdit, openDelete, nextId,
  };
}
