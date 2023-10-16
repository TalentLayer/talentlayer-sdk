export const getProtocolAndPlatformsFees = (
  originServicePlatformId: string,
  originValidatedProposalPlatformId: string,
): string => `
    {
      protocols {
        protocolEscrowFeeRate
      }
      servicePlatform: platform(id:${originServicePlatformId}){
        originServiceFeeRate
      }
      proposalPlatform: platform(id:${originValidatedProposalPlatformId}){
        originValidatedProposalFeeRate
      }
    }
  `;
