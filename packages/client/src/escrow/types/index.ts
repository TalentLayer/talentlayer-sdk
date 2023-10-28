import { ClientTransactionResponse } from '../../types';

export interface IEscrow {
  approve(
    serviceId: string,
    proposalId: string,
    metaEvidenceCid: string,
  ): Promise<ClientTransactionResponse>;
  release(serviceId: string, amount: bigint, userId: number): Promise<any>;
  reimburse(serviceId: string, amount: bigint, userId: number): Promise<any>;
  getProtocolAndPlatformsFees(
    originServicePlatformId: string,
    originValidatedProposalPlatformId: string,
  ): Promise<any>;
  getByService(serviceId: string, paymentType?: string): Promise<any>;
}
