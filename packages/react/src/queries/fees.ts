export function getProtocolAndPlatformsFees(
  originServicePlatformId: string,
  originValidatedProposalPlatformId: string,
) {
  const query = `
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

  return query;
}
