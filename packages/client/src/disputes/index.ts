import { parseEther, toHex, zeroAddress } from 'viem';
import { getChainConfig } from '../config';
import GraphQLClient from '../graphql';
import { getPlatformById } from '../platform/graphql/queries';
import { Config, DevConfig, NetworkEnum, TransactionHash } from '../types';
import { ViemClient } from '../viem';

export class Disputes {
  wallet: ViemClient;
  platformID: number;
  subgraph: GraphQLClient;
  chainId: NetworkEnum;
  devConfig?: DevConfig
  constructor(
    walletClient: ViemClient,
    platformId: number,
    graphQlClient: GraphQLClient,
    chainId: number,
    devConfig?: DevConfig
  ) {
    this.wallet = walletClient;
    this.platformID = platformId;
    this.subgraph = graphQlClient;
    this.chainId = chainId;
    this.devConfig = devConfig;
  }

  public async getArbitrationCost(): Promise<any> {
    const platformResponse = await this.subgraph.get(getPlatformById(this.platformID.toString()));

    if (!platformResponse?.data?.platform) {
      throw new Error('Platform not found');
    }
    const platform = platformResponse.data.platform;
    const arbitrator = platform?.arbitrator;

    if (!arbitrator || arbitrator == zeroAddress) {
      // return 0 as price if no arbitrator is set
      return 0;
    }

    const chainConfig: Config = this.devConfig ? this.devConfig.contractConfig : getChainConfig(this.chainId);
    const contract = chainConfig.contracts['talentLayerArbitrator'];

    console.log('SDK: reading contract');
    if (!contract) {
      throw Error('Invalid contract name passed.');
    }

    return this.wallet.publicClient.readContract({
      address: arbitrator,
      abi: contract.abi,
      functionName: 'arbitrationCost',
      args: [toHex(this.platformID, { size: 32 })],
    });
  }

  public async setPrice(value: number | string): Promise<TransactionHash> {
    const transformedPrice = parseEther(value.toString());
    console.log('SDK: setting arbitration price');
    const tx = await this.wallet.writeContract('talentLayerArbitrator', 'setArbitrationPrice', [
      this.platformID,
      transformedPrice,
    ]);

    return tx;
  }
}
