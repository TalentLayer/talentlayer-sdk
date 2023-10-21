import { useEffect, useState } from 'react';
import { IProposal, IReview } from '../types';
import useTalentLayer from './useTalentLayer';
import queries from '../queries';

export default function useReviews(serviceId: string) {
  const [data, setData] = useState<IReview[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    setLoading(true);
    if (!talentLayer.client) return;

    try {
      const query = queries.reviews.getReviewsByService(serviceId);
      const reviews = await talentLayer.subgraph.query(query);
      console.log(reviews.data)
      return setData(reviews.data);

      throw new Error('Proposal not found');
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
