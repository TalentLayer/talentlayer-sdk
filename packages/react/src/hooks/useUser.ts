import { useEffect, useState } from 'react';
import { IUser, OnlyOne } from '../types';
import useTalentLayer from './useTalentLayer';

export default function useUser(options: OnlyOne<{ userId: string; address: `0x${string}` }>) {
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    if (!talentLayer.client) return;
    
    try {
      if (options.userId) {
        const response = await talentLayer.client.profile.getById(options.userId);
        setUser(response);
      }

      if (options.address) {
        const response = await talentLayer.client.profile.getByAddress(options.address);
        setUser(response);
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
  }, []);

  return [user, loading, error] as const;
}
