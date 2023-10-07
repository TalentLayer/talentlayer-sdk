export type IToken = {
  name: string;
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  minimumTransactionAmount?: BigInt;
};

export enum NetworkEnum {
  MUMBAI = 80001,
  IEXEC = 134,
  POLYGON = 137,
}

export enum RateToken {
  NATIVE = "0x0000000000000000000000000000000000000000",
}

export type Config = {
  networkId: NetworkEnum;
  subgraphUrl: string;
  escrowConfig: { [key: string]: any };
  contracts: { [key: string]: { address: `0x${string}`; abi: any } };
  tokens: { [key: string]: IToken };
};

export type GraphQLConfig = {
  chainId: NetworkEnum;
  subgraphUrl: string;
};

export enum ServiceStatusEnum {
  Opened = "Opened",
  Confirmed = "Confirmed",
  Finished = "Finished",
  Cancelled = "Cancelled",
  Uncompleted = "Uncompleted",
}

export type GraphQLQuery = string;

export interface IProps {
  serviceStatus?: ServiceStatusEnum;
  buyerId?: string;
  sellerId?: string;
  numberPerPage?: number;
  offset?: number;
  searchQuery?: string;
  platformId?: string;
}

export type IPFSClientConfig = {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
};

export type ViemClientConfig = {
  rpcUrl?: string;
  privateKey?: `0x${string}`;
  mnemonic?: string;
  chainId?: NetworkEnum;
};

export type TalentLayerClientConfig = {
  chainId: NetworkEnum;
  ipfsConfig: IPFSClientConfig;
  walletConfig?: ViemClientConfig;
  platformId: number;
  signatureApiUrl?: string;
};

export type TalentLayerProfile = {
  title?: string;
  role?: string;
  image_url?: string;
  video_url?: string;
  name?: string;
  about?: string;
  skills?: string;
  [key: string]: any;
};

export type ProposalDetails = {
  about: string;
  video_url: string;
  [key: string]: any;
};

export interface ICreateServiceSignature {
  profileId: number;
  cid: string;
}

export interface CreateProposalArgs {
  profileId: number;
  serviceId: number;
  cid: string;
}

export type ServiceDetails = {
  title: string;
  about: string;
  keywords: string;
  rateToken: string;
  rateAmount: string;
  [key: string]: any;
};

export type ReviewDetails = {
  content: string;
  rating: number;
  [key: string]: any;
};

export type ClientTransactionResponse = {
  tx: `0x${string}`;
  cid: string;
};

export type TransactionHash = `0x${string}`;
