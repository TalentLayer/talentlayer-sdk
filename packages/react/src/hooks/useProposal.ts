import { useEffect, useState } from 'react';
import { IProposal, OnlyOne } from '../types';
import useTalentLayer from './useTalentLayer';
import queries from '../queries';

export default function useProposal(
  filter:
    | OnlyOne<{
        proposalId?: string;
        serviceId?: string;
        userId?: string;
      }>
    | undefined,
) {
  const [data, setData] = useState<IProposal | IProposal[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    setLoading(true);
    if (!talentLayer.client) return;

    try {
      if (filter === undefined) return setData(undefined);

      if (filter.proposalId !== undefined) {
        const proposals = await talentLayer.client.proposal.getOne(filter.proposalId);
        return setData(proposals as IProposal[]);
      }

      if (filter.serviceId !== undefined) {
        const query = queries.proposals.getAllProposalsByServiceId(filter.serviceId);
        const proposals = await talentLayer.subgraph.query(query);
        return setData(proposals.data.proposals as IProposal[]);
      }

      if (filter.userId !== undefined) {
        const query = queries.proposals.getAllProposalsByUser(filter.userId);
        const proposals = await talentLayer.subgraph.query(query);
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
