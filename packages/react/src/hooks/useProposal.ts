import { useEffect, useState } from 'react';
import { IProposal } from '../types';
import useTalentLayer from './useTalentLayer';

export default function useProposal(proposalId: string) {
  const [data, setData] = useState<IProposal>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    setLoading(true);
    if (!talentLayer.client) return;

    try {
      if (proposalId !== undefined) {
        const proposal = await talentLayer.client.proposal.getOne(proposalId);
        return setData(proposal);
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
  }, [proposalId]);

  return [data, loading, error] as const;
}
