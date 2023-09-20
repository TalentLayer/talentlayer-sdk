import { getGraphQLConfig } from './config';
import axios from 'axios';
import GraphQLClient, { serviceQueryFields, serviceDescriptionQueryFields } from './graphql';
import { CreateProposalArgs, CreateServiceArgs, IProps, ProposalMeta, TalentLayerClientConfig, TalentLayerProfile } from './types';
import IPFSClient from './ipfs';
import { ViemClient } from './viem';


// TODO: replace any here with the right type;
export class TalentLayerClient {
  graphQlClient: GraphQLClient
  ipfsClient?: IPFSClient
  viemClient: ViemClient

  constructor(config: TalentLayerClientConfig) {
    this.graphQlClient = new GraphQLClient(getGraphQLConfig(config.chainId))
    if (config.infuraClientId && config.infuraClientSecret) {
      this.ipfsClient = new IPFSClient({ infuraClientId: config.infuraClientId, infuraClientSecret: config.infuraClientSecret });
    }
    this.viemClient = new ViemClient(config.walletConfig || {});

  }

  static async getSignature(method: string, args: Record<string, any>) {
    const res = await axios.post(process.env.NEXT_PUBLIC_SIGNATURE_API_URL as string, {
      method,
      args,
    });

    return JSON.parse(res.data.result);
  }

  static async getServiceSignature(args: CreateServiceArgs) {
    return TalentLayerClient.getSignature('createService', args);
  }

  static async getProposalSignature(args: CreateProposalArgs) {
    return TalentLayerClient.getSignature('createProposal', args);
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

  // Blockhain Functions

  public async updateProfileData(userId: string, cid: string): Promise<any> {
    return this.viemClient.writeContract(
      'talentLayerId',
      'updateProfileData',
      [userId, cid],
    );
  }

  public async updateProposal(userId: string, serviceId: string, rateToken: string, rateAmount: string, cid: string, expirationDate: string) {
    return this.viemClient.writeContract(
      'serviceRegistry',
      'updateProposal',
      [userId, serviceId, rateToken, rateAmount, cid, expirationDate]
    )
  }

  public async createProposal(userId: string, serviceId: string, rateToken: string, rateAmount: string, cid: string, expirationDate: string, platformId: number) {
    console.log("SDK: creating proposal");
    const signature = await TalentLayerClient.getProposalSignature({ profileId: Number(userId), serviceId: Number(serviceId), cid })
    console.log("SDK: signature", signature);
    return this.viemClient.writeContract(
      'serviceRegistry',
      'createProposal',
      [
        userId,
        serviceId,
        rateToken,
        rateAmount,
        platformId,
        cid,
        expirationDate,
        signature
      ]
    )
  }

  // IPFS Functions
  public async uploadProfileDataToIpfs(profileData: TalentLayerProfile): Promise<string> {
    if (this.ipfsClient) {
      return this.ipfsClient.postToIpfs(JSON.stringify(profileData));
    }
    throw new Error("SDK initialised without ipfs config");
  }

  public async upploadProposalDataToIpfs(proposalMeta: ProposalMeta) {
    if (this.ipfsClient) {
      return this.ipfsClient.postToIpfs(JSON.stringify(proposalMeta));
    }
  }

  public async getWithQuery(query: string): Promise<any> {
    return this.graphQlClient.getFromSubgraph(query);
  };

  public getIpfsClient(): IPFSClient {
    if (this.ipfsClient) {
      return this.ipfsClient
    }

    throw Error("IPFS client not intiaislised properly")
  }

  // Graph functions
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