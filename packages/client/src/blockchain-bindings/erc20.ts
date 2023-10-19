import IPFSClient from '../ipfs';
import ERC20Contract from '../contracts/ABI/ERC20.json';

import { ViemClient } from '../viem';
import { getChainConfig } from '../config';
import { NetworkEnum } from '../types';

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

  constructor(
    ipfsClient: IPFSClient,
    viemClient: ViemClient,
    platformId: number,
    chainId: NetworkEnum,
  ) {
    console.log('SDK: erc20 initialising: ');

    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.chainId = chainId;
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

    const chainConfig = getChainConfig(this.chainId);
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

    const chainConfig = getChainConfig(this.chainId);
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
