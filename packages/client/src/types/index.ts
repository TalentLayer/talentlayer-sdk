import { Chain, Hash } from 'viem';

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
  LOCAL = 1
}

export enum RateToken {
  NATIVE = '0x0000000000000000000000000000000000000000',
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

export type GraphQLQuery = string;

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

type Currency = {
  decimals: number;
  name: string;
  symbol: string;
}

export type chainConfig = Chain;

export type DevConfig = {
  chainConfig: chainConfig,
  contractConfig: Config

}

export type TalentLayerClientConfig = {
  chainId: NetworkEnum;
  ipfsConfig: IPFSClientConfig;
  walletConfig?: ViemClientConfig;
  platformId: number;
  signatureApiUrl?: string;
  devConfig?: DevConfig
};

export type ClientTransactionResponse = {
  tx: Hash;
  cid: string;
};

export type TransactionHash = `0x${string}`;
