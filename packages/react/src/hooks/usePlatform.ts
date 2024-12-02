import { useEffect, useState } from 'react';
import { IPlatform } from '../types';
import useTalentLayer from './useTalentLayer';

export default function usePlatform(id?: string) {
  const [platforms, setAddresses] = useState<IPlatform | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    setLoading(true);

    if (!talentLayer.client) return;

    try {
      const response = await talentLayer.client.platform.getOne(
        id || talentLayer.platformId.toString(),
      );

      if (response) setAddresses(response);
      else throw new Error('Unable to find platform');
    } catch (error: any) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  return [platforms, loading, error] as const;
}
