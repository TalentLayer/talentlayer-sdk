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
}

export enum RateToken {
  NATIVE = '0x0000000000000000000000000000000000000000',
}

/**
 * Defines the Config type for predefined chains supported by TalentLayer
*/
export type Config = {
  networkId: NetworkEnum;
  subgraphUrl: string;
  escrowConfig: { [key: string]: any };
  contracts: { [key: string]: { address: `0x${string}`; abi: any } };
  tokens: { [key: string]: IToken };
};

export type CustomChainConfig = {
  networkId: number;
  chainDefinition: Chain;
  subgraphUrl: string;
  escrowConfig: { [key: string]: any };
  contracts: { [key: string]: { address: `0x${string}`; abi: any } };
  tokens: { [key: string]: IToken };
}

export type ChainConfig = Config | CustomChainConfig;

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
  chainConfig: ChainConfig;
};

export type TalentLayerClientConfig = {
  chainId?: NetworkEnum;
  ipfsConfig: IPFSClientConfig;
  walletConfig?: {
    rpcUrl?: string;
    privateKey?: `0x${string}`;
    mnemonic?: string;
  };
  platformId: number;
  signatureApiUrl?: string;
  customChainConfig?: ChainConfig;
};

/**
 * Represents the response of a transaction made through the client.
 * This type is typically used to encapsulate details of blockchain transactions initiated by the client.
 * 
 * @property {Hash} tx - The transaction hash that uniquely identifies the transaction on the blockchain.
 * @property {string} cid - The Content Identifier (CID) referring to the location of the transaction-related data stored on IPFS.
 */
export type ClientTransactionResponse = {
  tx: Hash;
  cid: string;
};

export type TransactionHash = `0x${string}`;
