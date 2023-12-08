import IPFSClient from '../ipfs';
import ERC20Contract from '../contracts/ABI/ERC20.json';

import { ViemClient } from '../viem';
import { ChainConfig } from '../types';

export interface IERC20 {
  balanceOf(tokenAddress: `0x${string}`): Promise<any>;
  checkAllowance(tokenAddress: `0x${string}`): Promise<any>;
  approve(tokenAddress: `0x${string}`, amount: bigint): Promise<any>;
}

export class ERC20 {
  ipfsClient: IPFSClient;
  viemClient: ViemClient;
  platformID: number;
  chainConfig: ChainConfig;

  constructor(
    ipfsClient: IPFSClient,
    viemClient: ViemClient,
    platformId: number,
    chainConfig: ChainConfig
  ) {
    console.log('SDK: erc20 initialising: ');

    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.chainConfig = chainConfig;
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
    // @ts-ignore
    const [address] = await this.viemClient.client.getAddresses();

    const chainConfig = this.chainConfig;
    const contract = chainConfig.contracts['talentLayerEscrow'];

    // @ts-ignore
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

    const chainConfig = this.chainConfig;
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
