import { getGraphQLConfig } from './config';
import GraphQLClient, { serviceQueryFields, serviceDescriptionQueryFields } from './graphql';
import { IProps, NetworkEnum } from './types';


// TODO: replace any here with the right type;
export class TalentLayerClient {
  graphQlClient: GraphQLClient
  constructor(chainId: NetworkEnum) {
    this.graphQlClient = new GraphQLClient(getGraphQLConfig(chainId))
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