import GraphQLClient from '../graphql';
import IPFSClient from '../ipfs';
import { getPlatformById } from '../platform/graphql/queries';
import { ClientTransactionResponse } from '../types';
import { getSignature } from '../utils/signature';
import { ViemClient } from '../viem';
import {
  getOne,
  getServices,
  searchServices,
} from './graphql/queries';
import {
  ICreateServiceSignature,
  IProps,
  IService,
  ServiceDetails,
} from './types';

export class Service implements IService {
  graphQlClient: GraphQLClient;
  ipfsClient: IPFSClient;
  viemClient: ViemClient;
  platformID: number;
  signatureApiUrl?: string;

  constructor(
    graphQlClient: GraphQLClient,
    ipfsClient: IPFSClient,
    viemClient: ViemClient,
    platformId: number,
    signatureApiUrl?: string,
  ) {
    console.log('SDK: service initialising: ');
    this.graphQlClient = graphQlClient;
    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.signatureApiUrl = signatureApiUrl;
  }

  public async getServiceSignature(args: ICreateServiceSignature) {
    return getSignature('createService', args, this.signatureApiUrl);
  }

  public async getOne(id: string): Promise<any> {
    const query = getOne(id);

    const response = await this.graphQlClient.get(query);

    return response?.data?.service || {};
  }

  public async updloadServiceDataToIpfs(serviceData: ServiceDetails): Promise<string> {
    if (this.ipfsClient) {
      return this.ipfsClient.post(JSON.stringify(serviceData));
    }

    throw new Error(IPFSClient.IPFS_CLIENT_ERROR);
  }

  public async getServices(params: IProps): Promise<any> {

    return this.graphQlClient.get(getServices(params));
  }

  public async search(params: IProps): Promise<any> {
    return this.graphQlClient.get(searchServices(params));
  }

  public async create(
    serviceDetails: ServiceDetails,
    userId: string,
    platformId: number,
    token: string,
    referralAmount: number = 0,
  ): Promise<ClientTransactionResponse> {
    const platformDetailsResponse = await this.graphQlClient.get(
      getPlatformById(this.platformID.toString()),
    );

    let servicePostingFee = platformDetailsResponse?.data?.platform.servicePostingFee;
    servicePostingFee = BigInt(servicePostingFee || '0');

    const cid = await this.updloadServiceDataToIpfs(serviceDetails);
    const signature = await this.getServiceSignature({
      profileId: Number(userId),
      cid,
    });

    const tx = await this.viemClient.writeContract(
      'talentLayerService',
      'createService',
      [userId, platformId, cid, signature, token, referralAmount],
      servicePostingFee,
    );

    if (cid && tx) {
      return { cid, tx };
    }

    throw new Error('Unable to create service');
  }

  public async update(
    serviceDetails: ServiceDetails,
    userId: string,
    serviceId: number,
    referralAmount: number = 0,
  ): Promise<ClientTransactionResponse> {
    const cid = await this.updloadServiceDataToIpfs(serviceDetails);

    const tx = await this.viemClient.writeContract(
      'talentLayerService',
      'updateService',
      [userId, serviceId, referralAmount, cid]
    );

    if (cid && tx) {
      return { cid, tx };
    }

    throw new Error('Unable to update service');
  }
}
