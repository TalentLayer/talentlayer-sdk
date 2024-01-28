import IPFSClient from '../ipfs';
import ERC20Contract from '../contracts/ABI/ERC20.json';

import { ViemClient } from '../viem';
import { getChainConfig } from '../config';
import { Config, CustomConfig, NetworkEnum } from '../types';
import { Logger } from '../logger';

export interface IERC20 {
  balanceOf(tokenAddress: `0x${string}`): Promise<any>;
  checkAllowance(tokenAddress: `0x${string}`): Promise<any>;
  approve(tokenAddress: `0x${string}`, amount: bigint): Promise<any>;
}

export class ERC20 {
  ipfsClient: IPFSClient;
  viemClient: ViemClient;
  platformID: number;
  chainId: NetworkEnum;
  customConfig?: CustomConfig

  constructor(
    ipfsClient: IPFSClient,
    viemClient: ViemClient,
    platformId: number,
    chainId: NetworkEnum,
    logger: Logger,
    customConfig?: CustomConfig
  ) {
    logger.info('ERC20 initialising: ');

    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.chainId = chainId;
    this.customConfig = customConfig
  }

  public async balanceOf(tokenAddress: `0x${string}`): Promise<any> {
    // @ts-ignore
    const [address] = await this.viemClient.client.getAddresses();

    // @ts-ignore
    const balance: any = await this.viemClient.publicClient.readContract({
      address: tokenAddress,
      abi: ERC20Contract.abi,
      functionName: 'balanceOf',
      args: [address],
    });

    return balance;
  }

  public async checkAllowance(tokenAddress: `0x${string}`): Promise<any> {

    const [address] = await this.viemClient.client.getAddresses();

    const chainConfig: Config = this.customConfig ? this.customConfig.contractConfig : getChainConfig(this.chainId);

    const contract = chainConfig.contracts['talentLayerEscrow'];

    const allowance: any = await this.viemClient.publicClient.readContract({
      address: tokenAddress,
      abi: ERC20Contract.abi,
      functionName: 'allowance',
      args: [address, contract.address],
    });

    return allowance;
  }

  public async approve(tokenAddress: `0x${string}`, amount: bigint): Promise<any> {
    // @ts-ignore
    const [address] = await this.viemClient.client.getAddresses();

    const chainConfig: Config = this.customConfig ? this.customConfig.contractConfig : getChainConfig(this.chainId);
    const contract = chainConfig.contracts['talentLayerEscrow'];

    // @ts-ignore
    const approval: any = await this.viemClient.client.writeContract({
      address: tokenAddress,
      abi: ERC20Contract.abi,
      functionName: 'approve',
      account: address,
      args: [contract.address, amount],
    });

    return approval;
  }
}
