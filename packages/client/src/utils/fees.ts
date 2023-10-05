import { FEE_RATE_DIVIDER } from "../constants";

export const calculateApprovalAmount = (proposalRateAmount: string, originServiceFeeRate: string, originValidatedProposalFeeRate: string, protocolEscrowFeeRate: string): bigint => {

    const jobRateAmount = BigInt(proposalRateAmount);
    const protocolFee = (jobRateAmount * BigInt(protocolEscrowFeeRate)) / BigInt(FEE_RATE_DIVIDER);
    const originServiceFee =
        (jobRateAmount * BigInt(originServiceFeeRate)) / BigInt(FEE_RATE_DIVIDER);
    const originValidatedProposalFee =
        (jobRateAmount * BigInt(originValidatedProposalFeeRate)) / BigInt(FEE_RATE_DIVIDER);
    const totalAmount: bigint = jobRateAmount + originServiceFee + originValidatedProposalFee + protocolFee;

    return totalAmount;
}