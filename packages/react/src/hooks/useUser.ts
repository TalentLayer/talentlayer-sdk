import { useEffect, useState } from 'react';
import { IUser, OnlyOne } from '../types';
import useTalentLayer from './useTalentLayer';
import queries from '../queries';

export default function useUser(options: OnlyOne<{ userId: string; address: string }>) {
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    if (!talentLayer.client) return;

    try {
      if (options.userId) {
        const query = queries.users.getUserById(options.userId);
        const response = await talentLayer.subgraph.query(query);
        setUser(response.data?.user);
      }

      if (options.address) {
        const query = queries.users.getUserByAddress(options.address);
        const response = await talentLayer.subgraph.query(query);
        setUser(response.data?.user);
      }

      setLoading(true);
    } catch (error: any) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [options]);

  return [user, loading, error] as const;
}
