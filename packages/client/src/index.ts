import { getChainConfig, getGraphQLConfig } from './config';
import GraphQLClient from './graphql';
import { Config, CustomChainConfig, NetworkEnum, TalentLayerClientConfig } from './types';
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
import { isCustomChainConfig, isNetworkEnum } from './utils/typeguard';

/**
 * Main client for interacting with the TalentLayer protocol.
 */
export class TalentLayerClient {
  /** @hidden */
  graphQlClient: GraphQLClient;
  /** @hidden */
  ipfsClient: IPFSClient;
  /** @hidden */
  viemClient: ViemClient;
  /** @hidden */
  platformID: number;
  /** @hidden */
  signatureApiUrl?: string;
  /** @hidden */
  chainConfig: Config | CustomChainConfig;

  /** @hidden */
  constructor(config: TalentLayerClientConfig) {
    console.log('SDK: client initialising', config);
    this.platformID = config.platformId;

    this.ipfsClient = new IPFSClient({
      baseUrl: config.ipfsConfig.baseUrl,
      clientId: config.ipfsConfig.clientId,
      clientSecret: config.ipfsConfig.clientSecret,
    });

    this.signatureApiUrl = config?.signatureApiUrl;

    if (config?.chainId) {
      this.chainConfig = getChainConfig(config.chainId);
    } else if (config.customChainConfig) {
      // if user has given custom chain config, that will take priority
      this.chainConfig = config.customChainConfig
    } else {
      throw Error('Atleast one of chainId or customChainConfig need to be provided')
    }

    if (isNetworkEnum(this.chainConfig.networkId)) {
      this.graphQlClient = new GraphQLClient(getGraphQLConfig(this.chainConfig.networkId));
    } else {
      this.graphQlClient = new GraphQLClient({ subgraphUrl: this.chainConfig.subgraphUrl, chainId: this.chainConfig.networkId });
    }

    this.viemClient = new ViemClient({ ...config.walletConfig, chainConfig: this.chainConfig });
  }

  /**
   * Returns chain config based on netowrk ID
   */
  public getChainConfig(networkId: NetworkEnum): Config {
    return getChainConfig(networkId);
  }


  /**
   * Returns chain config for current isntance of SDK
   */
  public getCurrentChainConfig(): Config {
    return this.chainConfig
  }

  /**
   * Provides access to ERC20 token functionalities.
   * @type {IERC20}
   */
  // @ts-ignore
  get erc20(): IERC20 {
    return new ERC20(this.ipfsClient, this.viemClient, this.platformID, this.chainConfig);
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
    return new Disputes(this.viemClient, this.platformID, this.graphQlClient, this.chainConfig);
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
      this.chainConfig
    );
  }
}
