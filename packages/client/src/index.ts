import { getGraphQLConfig } from './config';
import axios from 'axios';
import GraphQLClient, { serviceQueryFields, serviceDescriptionQueryFields } from './graphql';
import { ClientTransactionResponse, CreateProposalArgs, ICreateServiceSignature, IProps, ProposalDetails, ServiceDetails, TalentLayerClientConfig, TalentLayerProfile } from './types';
import IPFSClient from './ipfs';
import { ViemClient } from './viem';
import { arch } from 'os';


// Define a new interface for the profile-related methods
interface Profile {
  update(userId: string, cid: string): Promise<any>;
}

interface Proposal {
  getSignature(args: CreateProposalArgs): Promise<any>;

  getOne(proposalId: string): Promise<any>;

  create(
    proposalDetails: ProposalDetails,
    userId: string,
    serviceId: string,
    rateToken: string,
    rateAmount: string,
    expirationDate: string,
    platformId: number): Promise<ClientTransactionResponse>;

  update(
    proposalDetails: ProposalDetails,
    userId: string,
    serviceId: string,
    rateToken: string,
    rateAmount: string,
    expirationDate: string
  ): Promise<ClientTransactionResponse>
}

interface Escrow {
  // approve()
  createTransaction(serviceId: string, proposalId: string, metaEvidenceCid: string, value: bigint): Promise<ClientTransactionResponse>
}

interface ERC20 {
  // balanceOf
}

// TODO: replace any here with the right type;
export class TalentLayerClient {
  graphQlClient: GraphQLClient
  ipfsClient?: IPFSClient
  viemClient: ViemClient

  static readonly PUBLIC_SIGNATURE_API_URL: string = "https://api.defender.openzeppelin.com/autotasks/4b1688f9-01a4-435d-89ae-d05e0aa0a53b/runs/webhook/b9818d77-3c43-4c3d-bfb8-4c77036de92f/ACXhXsQoCKP8zZVE26gFbh";

  constructor(config: TalentLayerClientConfig) {
    this.graphQlClient = new GraphQLClient(getGraphQLConfig(config.chainId))
    if (config.infuraClientId && config.infuraClientSecret) {
      this.ipfsClient = new IPFSClient({ infuraClientId: config.infuraClientId, infuraClientSecret: config.infuraClientSecret });
    }
    this.viemClient = new ViemClient(config.walletConfig || {});

  }

  static async getSignature(method: string, args: Record<string, any>) {
    const res = await axios.post(TalentLayerClient.PUBLIC_SIGNATURE_API_URL, {
      method,
      args,
    });

    return JSON.parse(res.data.result);
  }

  static async getServiceSignature(args: ICreateServiceSignature) {
    return TalentLayerClient.getSignature('createService', args);
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
  public profile: Profile = {
    update: async (userId: string, cid: string): Promise<any> => {
      return this.viemClient.writeContract(
        'talentLayerId',
        'updateProfileData',
        [userId, cid],
      );
    },
  };

  public proposal: Proposal = {
    getOne: async (proposalId: string) => {
      const query = `
      {
        proposals(where: {id: "${proposalId}"}) {
          seller {
            id
            handle
            address
            cid
            rating
            userStats {
              numReceivedReviews
            }
          }
          service {
            id
          }
          cid
          rateToken {
            address
          }
          rateAmount
          description {
            about
            video_url
          }
          status
          expirationDate
        }
      }
    `;

      const response = await this.graphQlClient.getFromSubgraph(query);
      if (Array.isArray(response?.data?.proposals) && response?.data?.proposals?.length > 0) {
        return response?.data?.proposals[0];
      }
      return null;
    },

    getSignature: async (args: CreateProposalArgs) => {
      return TalentLayerClient.getSignature('createProposal', args);
    },

    create: async (
      proposalDetails: ProposalDetails,
      userId: string,
      serviceId: string,
      rateToken: string,
      rateAmount: string,
      expirationDate: string,
      platformId: number
    ): Promise<ClientTransactionResponse> => {
      const cid = await this.upploadProposalDataToIpfs(proposalDetails);
      const signature = await this.proposal.getSignature({ profileId: Number(userId), serviceId: Number(serviceId), cid })

      const tx = await this.viemClient.writeContract(
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

      if (cid && tx) {
        return { cid, tx }
      }

      throw new Error('Unable to update propsal service');

    },

    update: async (
      proposalDetails: ProposalDetails,
      userId: string,
      serviceId: string,
      rateToken: string,
      rateAmount: string,
      expirationDate: string
    ): Promise<ClientTransactionResponse> => {
      const cid = await this.upploadProposalDataToIpfs(proposalDetails);
      const tx = await this.viemClient.writeContract(
        'serviceRegistry',
        'updateProposal',
        [
          userId,
          serviceId,
          rateToken,
          rateAmount,
          cid,
          expirationDate
        ]
      )

      if (cid && tx) {
        return { cid, tx }
      }

      throw new Error('Unable to update propsal service');
    }
  }

  public escrow: Escrow = {
    createTransaction: async (serviceId: string, proposalId: string, metaEvidenceCid: string, value: bigint): Promise<ClientTransactionResponse> => {
      const proposal = await this.proposal.getOne(proposalId);

      if (!proposal) {
        throw new Error("Proposal not found");
      }

      if (!proposal.cid) {
        throw new Error("Proposal cid not found");
      }

      const sellerId: string = proposal.seller.id;

      const tx = await this.viemClient.writeContract(
        "talentLayerEscrow",
        "createTransaction",
        [
          parseInt(serviceId, 10),
          parseInt(sellerId, 10),
          metaEvidenceCid,
          proposal.cid
        ],
        value
      )

      if (tx) {
        return { tx, cid: proposal.cid }
      }

      throw new Error("Error creating Transaction");
    }
  }

  public async createService(serviceDetails: ServiceDetails, userId: string, platformId: number): Promise<ClientTransactionResponse> {

    const cid = await this.updloadServiceDataToIpfs(serviceDetails);
    const signature = await TalentLayerClient.getServiceSignature({ profileId: Number(userId), cid })

    const tx = await this.viemClient.writeContract(
      'serviceRegistry',
      'createService',
      [
        userId,
        platformId,
        cid,
        signature
      ]
    )

    if (cid && tx) {
      return { cid, tx }
    }

    throw new Error('Unable to create service');
  }



  // IPFS Functions

  public async updloadServiceDataToIpfs(serviceData: ServiceDetails) {
    if (this.ipfsClient) {
      return this.ipfsClient.post(JSON.stringify(serviceData));
    }

    throw new Error(IPFSClient.IPFS_CLIENT_ERROR);
  }

  public async uploadProfileDataToIpfs(profileData: TalentLayerProfile): Promise<string> {
    if (this.ipfsClient) {
      return this.ipfsClient.post(JSON.stringify(profileData));
    }
    throw new Error(IPFSClient.IPFS_CLIENT_ERROR);
  }

  public async upploadProposalDataToIpfs(proposalDetails: ProposalDetails) {
    if (this.ipfsClient) {
      return this.ipfsClient.post(JSON.stringify(proposalDetails));
    }
  }

  public async getWithQuery(query: string): Promise<any> {
    return this.graphQlClient.getFromSubgraph(query);
  };

  public getIpfsClient(): IPFSClient {
    if (this.ipfsClient) {
      return this.ipfsClient
    }

    throw Error(IPFSClient.IPFS_CLIENT_ERROR)
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