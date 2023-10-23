import GraphQLClient from '../graphql';
import IPFSClient from '../ipfs';
import { ViemClient } from '../viem';
import { getPaymentsForUser, getUserById, getUserTotalGains, getUsers } from './graphql';

export class User {
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
    this.graphQlClient = graphQlClient;
    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.signatureApiUrl = signatureApiUrl;
  }

  public async getOne(userId: string): Promise<any> {
    const query = getUserById(userId);

    const response = await this.graphQlClient.get(query);

    return response?.data?.user || null;
  }

  public async getUsers(params: {
    numberPerPage?: number;
    offset?: number;
    searchQuery?: string;
  }): Promise<any> {
    const query = getUsers(params.numberPerPage, params.offset, params.searchQuery);

    return this.graphQlClient.get(query);
  }

  public async getTotalGains(userId: string): Promise<any> {
    const query = getUserTotalGains(userId);

    const response = await this.graphQlClient.get(query);

    return response?.data?.user?.totalGains || null;
  }

  public async getPayments(
    userId: string,
    numberPerPage?: number,
    offset?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<any> {
    const query = getPaymentsForUser(userId, numberPerPage, offset, startDate, endDate)

    const response = await this.graphQlClient.get(query);

    return response?.data?.payments || null
  }
}
