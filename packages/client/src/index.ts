import { getChainConfig, getGraphQLConfig } from './config';
import GraphQLClient from './graphql';
import { Config, DevConfig, NetworkEnum, TalentLayerClientConfig } from './types';
import IPFSClient from './ipfs';
import { ViemClient } from './viem';
import { IERC20, ERC20 } from './blockchain-bindings/erc20';
import { Platform } from './platform';
import { IPlatform } from './platform/types';
import { IDispute } from './disputes/types';
import { Disputes } from './disputes';
import { Proposal } from './proposals';
import { IProposal } from './proposals/types';
import { Profile } from './profile';
import { IProfile } from './profile/types';
import { Escrow } from './escrow';
import { IEscrow } from './escrow/types';
import { IService, Service } from './services';
import { IReview } from './reviews/types';
import { Review } from './reviews';

/**
 * Main client for interacting with the TalentLayer protocol.
 */
export class TalentLayerClient {
  graphQlClient: GraphQLClient;
  ipfsClient: IPFSClient;
  viemClient: ViemClient;
  platformID: number;
  chainId: NetworkEnum | number;
  signatureApiUrl?: string;
  devConfig?: DevConfig;

  /**
   * Initializes a new instance of the TalentLayerClient.
   * @param {TalentLayerClientConfig} config - Configuration options for the client.
   */
  constructor(config: TalentLayerClientConfig) {
    console.log('SDK: client initialising', config);
    this.platformID = config.platformId;
    this.graphQlClient = new GraphQLClient(getGraphQLConfig(config.chainId));
    this.ipfsClient = new IPFSClient({
      baseUrl: config.ipfsConfig.baseUrl,
      clientId: config.ipfsConfig.clientId,
      clientSecret: config.ipfsConfig.clientSecret,
    });
    this.viemClient = new ViemClient(config.chainId, config.walletConfig || {});
    this.chainId = config.chainId;
    this.signatureApiUrl = config?.signatureApiUrl;

    // DEV mode overrides
    if (config.devConfig) {
      this.devConfig = config?.devConfig;
      this.chainId = config.devConfig.chainConfig.id
      this.graphQlClient = new GraphQLClient(getGraphQLConfig(config.devConfig.chainConfig.id));
      this.viemClient = new ViemClient(config.devConfig.chainConfig.id, config.walletConfig || {}, this.devConfig);
    }
  }

  /**
   * Returns chain config based on netowrk ID
   */
  public getChainConfig(networkId: NetworkEnum): Config {
    if (this.devConfig) {
      return this.devConfig.contractConfig;
    }
    return getChainConfig(networkId);
  }

  /**
   * Provides access to ERC20 token functionalities.
   * @type {IERC20}
   */
  // @ts-ignore
  get erc20(): IERC20 {
    return new ERC20(this.ipfsClient, this.viemClient, this.platformID, this.chainId, this.devConfig);
  }

  /**
   * Provides access to proposal functionalities.
   * Use this to create, update, approve, proposals
   * @type {IProposal}
   */
  // @ts-ignore
  get proposal(): IProposal {
    return new Proposal(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID,
      this.signatureApiUrl,
    );
  }

  /**
   * Provides access to dispute functionalities.
   * @type {IPlatform}
   */
  // @ts-ignore
  get platform(): IPlatform {
    return new Platform(this.graphQlClient, this.viemClient, this.platformID, this.ipfsClient);
  }

  /**
   * Provides access to platform functionalities.
   * @type {IDispute}
   */
  // @ts-ignore
  get disputes(): IDispute {
    return new Disputes(this.viemClient, this.platformID, this.graphQlClient, this.chainId);
  }

  /**
   * Provides access to service functionalities.
   * @type {IService}
   */

  // @ts-ignore
  get service(): IService {
    return new Service(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID,
      this.signatureApiUrl,
    );
  }

  /**
   * Provides access to dispute functionalities.
   * @type {IProfile}
   */
  // @ts-ignore
  get profile(): IProfile {
    return new Profile(this.graphQlClient, this.ipfsClient, this.viemClient, this.platformID);
  }

  /**
   * Provides access to review functionalities.
   * @type {IReview}
   */
  // @ts-ignore
  get review(): IReview {
    return new Review(this.graphQlClient, this.ipfsClient, this.viemClient, this.platformID);
  }

  /**
   * Provides access to escrow functionalities.
   * @type {IEscrow}
   */
  // @ts-ignore
  get escrow(): IEscrow {
    return new Escrow(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID,
      this.chainId,
    );
  }
}
