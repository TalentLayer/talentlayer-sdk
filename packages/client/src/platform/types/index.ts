import { Hash } from 'viem';
import { ClientTransactionResponse, NetworkEnum, TransactionHash } from '../../types';

export type PlatformDetails = {
  about: string;
  website: string;
  video_url: string;
  image_url: string;
  [key: string]: any;
};

export type Arbitrator = {
  address: Hash;
  name: string;
};

export interface IPlatform {
  getOne(id: string): Promise<any>;
  update(data: PlatformDetails): Promise<ClientTransactionResponse>;
  updateOriginServiceFeeRate(value: number): Promise<TransactionHash>;
  updateOriginValidatedProposalFeeRate(value: number): Promise<TransactionHash>;
  updateServicePostingFee(value: number): Promise<TransactionHash>;
  updateProposalPostingFee(value: number): Promise<TransactionHash>;
  getByOwner(address: `0x${string}`): Promise<any>;
  setFeeTimeout(timeout: number): Promise<TransactionHash>;
  getArbitrators(chainId: NetworkEnum): Arbitrator[];
  updateArbitrator(address: `0x${string}`): Promise<TransactionHash>;
}
