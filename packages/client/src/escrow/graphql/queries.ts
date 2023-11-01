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

export const getPaymentsByService = (serviceId: string, paymentType?: string) => {
  let condition = `where: {service: "${serviceId}"`;
  paymentType ? (condition += `, paymentType: "${paymentType}"`) : '';
  condition += '}, orderBy: id, orderDirection: asc';
  const query = `
{
  payments(${condition}) {
    id
    amount
    rateToken {
      address
      decimals
      name
      symbol
    }
    paymentType
    transactionHash
    createdAt
  }
}
`;
  return query;
};
