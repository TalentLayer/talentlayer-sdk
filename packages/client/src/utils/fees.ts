import {FEE_RATE_DIVIDER} from '../constants';

export const calculateApprovalAmount = (
  proposalRateAmount: string,
  originServiceFeeRate: string,
  originValidatedProposalFeeRate: string,
  protocolEscrowFeeRate: string,
  referralAmount: string,
): bigint => {
  const jobRateAmount = BigInt(proposalRateAmount) + BigInt(referralAmount);
  const protocolFee = (jobRateAmount * BigInt(protocolEscrowFeeRate)) / BigInt(FEE_RATE_DIVIDER);
  const originServiceFee =
    (jobRateAmount * BigInt(originServiceFeeRate)) / BigInt(FEE_RATE_DIVIDER);
  const originValidatedProposalFee =
    (jobRateAmount * BigInt(originValidatedProposalFeeRate)) / BigInt(FEE_RATE_DIVIDER);
  return jobRateAmount + originServiceFee + originValidatedProposalFee + protocolFee;
};
