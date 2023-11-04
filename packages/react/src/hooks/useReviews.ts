import { useEffect, useState } from 'react';
import { IReview } from '../types';
import useTalentLayer from './useTalentLayer';

export default function useReviews(serviceId: string) {
  const [data, setData] = useState<IReview[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    setLoading(true);
    if (!talentLayer.client) return;

    try {
      const reviews = await talentLayer.client.review.getByService(serviceId);

      return setData(reviews.data);
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

  return [data, loading, error] as const;
}
