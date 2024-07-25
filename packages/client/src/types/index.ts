import { Chain, Hash, WalletClient } from 'viem';

export type IToken = {
  name: string;
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  minimumTransactionAmount?: BigInt;
};

export enum NetworkEnum {
  MUMBAI = 80001,
  AMOY = 80002,
  IEXEC = 134,
  POLYGON = 137,
  FUJI = 43113,
  LOCAL = 1,
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
  clientSecret: string;
  baseUrl: string;
};

export type ViemClientConfig = {
  rpcUrl?: string;
  privateKey?: `0x${string}`;
  mnemonic?: string;
  chainId?: NetworkEnum;
  walletClient?: WalletClient;
};

type Currency = {
  decimals: number;
  name: string;
  symbol: string;
};

export type chainConfig = Chain;

/**
 * Represents a custom config that can be passed to the sdk during initialisation of the client
 * Typically, it should bne used in order to use the sdk with a custom chain and contracts
 *
 * @property {chainConfig} chainConfig - The config of the custom chain that the sdk is being used for
 * @property {Config} contractConfig - The custom contracts to be used with the sdk
 */

export type CustomConfig = {
  chainConfig: chainConfig;
  contractConfig: Config;
};

export type TalentLayerClientConfig = {
  chainId: NetworkEnum;
  ipfsConfig: IPFSClientConfig;
  walletConfig?: ViemClientConfig;
  platformId: number;
  signatureApiUrl?: string;
  customConfig?: CustomConfig;
  debug?: Boolean;
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
