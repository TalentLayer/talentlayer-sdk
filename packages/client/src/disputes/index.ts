import { Hash, parseEther, toHex, zeroAddress } from 'viem';
import { getChainConfig } from '../config';
import GraphQLClient from '../graphql';
import { Logger } from '../logger';
import { getPlatformById } from '../platform/graphql/queries';
import { Config, CustomConfig, NetworkEnum, TransactionHash } from '../types';
import { ViemClient } from '../viem';

/**
 * Get arbitration cost. Set price of arbitration
 *
 * @group TalentLayerClient Modules
 */
export class Disputes {

  /** @hidden */
  wallet: ViemClient;
  /** @hidden */
  platformID: number;
  /** @hidden */
  subgraph: GraphQLClient;
  /** @hidden */
  chainId: NetworkEnum;
  /** @hidden */
  customConfig?: CustomConfig;
  /** @hidden */
  logger: Logger;

  /** @hidden */
  constructor(
    walletClient: ViemClient,
    platformId: number,
    graphQlClient: GraphQLClient,
    chainId: number,
    logger: Logger,
    customConfig?: CustomConfig
  ) {
    this.logger = logger
    this.wallet = walletClient;
    this.platformID = platformId;
    this.subgraph = graphQlClient;
    this.chainId = chainId;
    this.customConfig = customConfig;
  }

  /**
 * getArbitrationCost - Retrieves the current cost of arbitration. This function is useful for understanding the financial implications of initiating an arbitration process.
 * @returns {Promise<any>} - Returns a Promise that resolves to the arbitration cost, typically in a numerical or string format representing the cost value.
 */
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

    const chainConfig: Config = this.customConfig ? this.customConfig.contractConfig : getChainConfig(this.chainId);
    const contract = chainConfig.contracts['talentLayerArbitrator'];

    this.logger.debug(`Reading Arbitrator contract at address ${contract.address}`);
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

  /**
 * setPrice - Sets the price of arbitration. This function allows for modifying the arbitration cost for the current platform
 * @param {number | string} value - The new price value for arbitration, which can be specified as a number or a string representing the price.
 * @returns {Promise<Hash>} - A promise that resolves to the transaction hash of the set operation.
 */
  public async setPrice(value: number | string): Promise<Hash> {
    const transformedPrice = parseEther(value.toString());
    this.logger.debug(`Setting arbitration price to ${transformedPrice}`);

    const tx = await this.wallet.writeContract('talentLayerArbitrator', 'setArbitrationPrice', [
      this.platformID,
      transformedPrice,
    ]);

    return tx;
  }
}
