import { getGraphQLConfig } from './config';
import axios from 'axios';
import GraphQLClient from './graphql';
import { TalentLayerClientConfig } from './types';
import IPFSClient from './ipfs';
import { ViemClient } from './viem';
import { IService, Service } from './blockchain-bindings/service';
import { IReview, Review } from './blockchain-bindings/review';
import { IProfile, Profile } from './blockchain-bindings/profile';
import { IProposal, Proposal } from './blockchain-bindings/proposal';
import { Escrow, IEscrow } from './blockchain-bindings/escrow';
import { IERC20, ERC20 } from './blockchain-bindings/erc20';
import { IPlatform, Platform } from './platform';

// TODO: replace any here with the right type;
export class TalentLayerClient {
  graphQlClient: GraphQLClient
  ipfsClient: IPFSClient
  viemClient: ViemClient
  platformID: number;
  static readonly PUBLIC_SIGNATURE_API_URL: string = "https://api.defender.openzeppelin.com/autotasks/4b1688f9-01a4-435d-89ae-d05e0aa0a53b/runs/webhook/b9818d77-3c43-4c3d-bfb8-4c77036de92f/ACXhXsQoCKP8zZVE26gFbh";

  constructor(config: TalentLayerClientConfig) {
    console.log("SDK: client initialising");
    this.platformID = config.platformId
    this.graphQlClient = new GraphQLClient(getGraphQLConfig(config.chainId))
    this.ipfsClient = new IPFSClient({ infuraClientId: config.infuraClientId, infuraClientSecret: config.infuraClientSecret });
    this.viemClient = new ViemClient(config.walletConfig || {});
  }

  static async getSignature(method: string, args: Record<string, any>) {
    const res = await axios.post(TalentLayerClient.PUBLIC_SIGNATURE_API_URL, {
      method,
      args,
    });

    return JSON.parse(res.data.result);
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
      this.platformID
    )
  }

  // @ts-ignore
  get platform(): IPlatform {
    return new Platform(
      this.graphQlClient
    )
  }

  // @ts-ignore
  get service(): IService {
    return new Service(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID
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