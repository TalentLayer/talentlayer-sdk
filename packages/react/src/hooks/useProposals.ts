import { useEffect, useState } from 'react';
import { IProposal, OnlyOne } from '../types';
import useTalentLayer from './useTalentLayer';

export default function useProposals(
  filter?: OnlyOne<{
    serviceId?: string;
    userId?: string;
  }>,
) {
  const [data, setData] = useState<IProposal[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    setLoading(true);
    if (!talentLayer.client) return;

    try {
      if (filter === undefined) return setData(undefined);

      if (filter.serviceId !== undefined) {
        const proposals = await talentLayer.client.proposal.getByServiceId(filter.serviceId);
        return setData(proposals.data.proposals as IProposal[]);
      }

      if (filter.userId !== undefined) {
        const proposals = await talentLayer.client.proposal.getByUser(filter.userId);

        return setData(proposals.data.proposals as IProposal[]);
      }

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
