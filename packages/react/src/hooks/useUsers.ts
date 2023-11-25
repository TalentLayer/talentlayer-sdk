import { useEffect, useState } from 'react';
import { IUser } from '../types';
import useTalentLayer from './useTalentLayer';

export default function useUsers(options: { searchQuery?: string; numberPerPage?: number }) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    if (!talentLayer.client) return;

    try {
      setLoading(true);
      const response = await talentLayer.client.profile.getBy({});

      if (offset === 0) {
        setUsers(response.data.users || []);
      } else {
        setUsers([...users, ...response.data.users]);
      }

      if (options.numberPerPage && response?.data?.users.length < options.numberPerPage) {
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }
    } catch (error: any) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setUsers([]);
    setOffset(0);
  }, [options.searchQuery]);

  useEffect(() => {
    loadData();
  }, [options.numberPerPage, options.searchQuery, offset]);

  function loadMore() {
    options.numberPerPage ? setOffset(offset + options.numberPerPage) : '';
  }

  return [{ items: users, hasMoreData, loadMore } as const, loading, error] as const;
}
