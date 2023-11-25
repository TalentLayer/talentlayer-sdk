import { useState, useEffect } from 'react';
import { IService } from '../types';
import useTalentLayer from './useTalentLayer';

export default function useService(serviceId: string) {
  const [service, setService] = useState<IService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    setLoading(true);
    if (!talentLayer.client) return;

    try {
      const response = await talentLayer.client.service.getOne(serviceId);
      setService(response);
    } catch (error: any) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [serviceId]);

  return [service, loading, error];
}
