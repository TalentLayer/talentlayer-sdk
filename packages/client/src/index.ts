import { getGraphQLConfig } from './config';
import GraphQLClient, { serviceQueryFields, serviceDescriptionQueryFields } from './graphql';
import { IProps, NetworkEnum, TalentLayerClientConfig, TalentLayerProfile } from './types';
import IPFSClient from './ipfs';


// TODO: replace any here with the right type;
export class TalentLayerClient {
  graphQlClient: GraphQLClient
  ipfsClient?: IPFSClient
  constructor(config: TalentLayerClientConfig) {
    this.graphQlClient = new GraphQLClient(getGraphQLConfig(config.chainId))
    if (config.infuraClientId && config.infuraClientSecret) {
      this.ipfsClient = new IPFSClient({ infuraClientId: config.infuraClientId, infuraClientSecret: config.infuraClientSecret });
    }

  }

  public async uploadProfileDataToIpfs(profileData: TalentLayerProfile): Promise<string> {
    if (this.ipfsClient) {
      return this.ipfsClient.postToIpfs(JSON.stringify(profileData));
    }
    throw new Error("SDK initialised without ipfs config");
  }

  static getFilteredServiceCondition(params: IProps): string {
    let condition = ', where: {';
    condition += params.serviceStatus ? `status: "${params.serviceStatus}"` : '';
    condition += params.buyerId ? `, buyer: "${params.buyerId}"` : '';
    condition += params.sellerId ? `, seller: "${params.sellerId}"` : '';
    condition += params.platformId ? `, platform: "${params.platformId}"` : '';
    condition += '}';
    return condition === ', where: {}' ? '' : condition;
  };

  static getFilteredServiceDescriptionCondition(params: IProps): string {
    let condition = ', where: {';
    condition += params.serviceStatus ? `service_: {status:"${params.serviceStatus}"}` : '';
    condition += params.buyerId ? `, buyer: "${params.buyerId}"` : '';
    condition += params.sellerId ? `, seller: "${params.sellerId}"` : '';
    condition += params.platformId ? `, platform: "${params.platformId}"` : '';
    condition += '}';
    return condition === ', where: {}' ? '' : condition;
  };

  public async getWithQuery(query: string): Promise<any> {
    return this.graphQlClient.getFromSubgraph(query);
  };

  public getIpfsClient(): IPFSClient {
    if (this.ipfsClient) {
      return this.ipfsClient
    }

    throw Error("IPFS client not intiaislised properly")
  }

  public async getServices(params: IProps): Promise<any> {
    const pagination = params.numberPerPage
      ? 'first: ' + params.numberPerPage + ', skip: ' + params.offset
      : '';
    const query = `
      {
        services(orderBy: id, orderDirection: desc ${pagination} ${TalentLayerClient.getFilteredServiceCondition(
      params,
    )}) {
          ${serviceQueryFields}
          description {
            ${serviceDescriptionQueryFields}
          }
        }
      }`;

    return this.graphQlClient.getFromSubgraph(query);
  };

  public async searchServices(params: IProps): Promise<any> {
    const pagination = params.numberPerPage
      ? 'first: ' + params.numberPerPage + ' skip: ' + params.offset
      : '';
    const query = `
      {
        serviceDescriptionSearchRank(
          text: "${params.searchQuery}",
          orderBy: id orderDirection: desc ${pagination} ${TalentLayerClient.getFilteredServiceDescriptionCondition(
      params,
    )}
        ){
          ${serviceDescriptionQueryFields}
          service {
            ${serviceQueryFields}
          }
        }
      }`;
    return this.graphQlClient.getFromSubgraph(query);
  };

  public async fetchServiceById(id: number): Promise<any> {
    const query = `
    {
      service(id: "${id}") {
        ${serviceQueryFields}
        description {
          ${serviceDescriptionQueryFields}
        }
      }
    }
    `;
    return this.graphQlClient.getFromSubgraph(query);
  }
}