import { useEffect, useState } from 'react';
import { IFees } from '../types';
import useTalentLayer from './useTalentLayer';
import queries from '../queries';

export default function useFees(
  originServicePlatformId: string,
  originValidatedProposalPlatformId: string,
) {
  const [fees, setFees] = useState({
    protocolEscrowFeeRate: 0,
    originServiceFeeRate: 0,
    originValidatedProposalFeeRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    setLoading(true);
    const fees: IFees = {
      protocolEscrowFeeRate: 0,
      originServiceFeeRate: 0,
      originValidatedProposalFeeRate: 0,
    };
    try {
      const query = queries.fees.getProtocolAndPlatformsFees(
        originServicePlatformId,
        originValidatedProposalPlatformId,
      );
      const response = await talentLayer.subgraph.query(query);
      const data = response.data;

      if (data) {
        fees.protocolEscrowFeeRate = data.protocols[0].protocolEscrowFeeRate;
        fees.originServiceFeeRate = data.servicePlatform.originServiceFeeRate;
        fees.originValidatedProposalFeeRate = data.proposalPlatform.originValidatedProposalFeeRate;
      }

      setFees(fees);
    } catch (error: any) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [originServicePlatformId, originValidatedProposalPlatformId]);

  return [fees, loading, error] as const;
}
