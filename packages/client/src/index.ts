import { getGraphQLConfig } from './config';
import axios from 'axios';
import GraphQLClient from './graphql';
import { NetworkEnum, TalentLayerClientConfig } from './types';
import IPFSClient from './ipfs';
import { ViemClient } from './viem';
import { IService, Service } from './blockchain-bindings/service';
import { IReview, Review } from './blockchain-bindings/review';
import { IProfile, Profile } from './blockchain-bindings/profile';
import { IProposal, Proposal } from './blockchain-bindings/proposal';
import { Escrow, IEscrow } from './blockchain-bindings/escrow';
import { IERC20, ERC20 } from './blockchain-bindings/erc20';
import { Platform } from './platform';
import { IPlatform } from './platform/types';
import { IDispute } from './disputes/types';
import { Disputes } from './disputes';

// TODO: replace any here with the right type;
export class TalentLayerClient {
  graphQlClient: GraphQLClient
  ipfsClient: IPFSClient
  viemClient: ViemClient
  platformID: number;
  chainId: NetworkEnum;
  signatureApiUrl?: string;

  constructor(config: TalentLayerClientConfig) {
    console.log("SDK: client initialising", config);
    this.platformID = config.platformId
    this.graphQlClient = new GraphQLClient(getGraphQLConfig(config.chainId))
    this.ipfsClient = new IPFSClient({ baseUrl: config.ipfsConfig.baseUrl, clientId: config.ipfsConfig.clientId, clientSecret: config.ipfsConfig.clientSecret });
    this.viemClient = new ViemClient(config.walletConfig || {});
    this.chainId = config.chainId;
    this.signatureApiUrl = config?.signatureApiUrl;
  }

  // @ts-ignore
  get erc20(): IERC20 {
    return new ERC20(
      this.ipfsClient,
      this.viemClient,
      this.platformID
    )
  }

  // @ts-ignore
  get proposal(): IProposal {
    return new Proposal(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID,
      this.signatureApiUrl
    )
  }

  // @ts-ignore
  get platform(): IPlatform {
    return new Platform(
      this.graphQlClient,
      this.viemClient,
      this.platformID,
      this.ipfsClient
    )
  }

  // @ts-ignore
  get disputes(): IDispute {
    return new Disputes(
      this.viemClient,
      this.platformID,
      this.graphQlClient,
      this.chainId
    )
  }

  // @ts-ignore
  get service(): IService {
    return new Service(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID,
      this.signatureApiUrl
    );
  }

  // @ts-ignore
  get profile(): IProfile {
    return new Profile(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID
    )
  }

  // @ts-ignore
  get review(): IReview {
    return new Review(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID
    );
  }

  // @ts-ignore
  get escrow(): IEscrow {
    return new Escrow(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID
    )
  }
}