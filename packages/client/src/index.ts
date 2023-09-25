// @ts-nocheck
import { contracts, getGraphQLConfig } from './config';
import axios from 'axios';
import GraphQLClient, { serviceQueryFields, serviceDescriptionQueryFields } from './graphql';
import { ClientTransactionResponse, CreateProposalArgs, ICreateServiceSignature, IProps, ProposalDetails, RateToken, ServiceDetails, TalentLayerClientConfig, TalentLayerProfile } from './types';
import IPFSClient from './ipfs';
import { ViemClient } from './viem';
import ERC20 from "./contracts/ABI/ERC20.json";
import { IService, Service } from './blockchain-bindings/service';
import { IReview, Review } from './blockchain-bindings/review';
import { IProfile, Profile } from './blockchain-bindings/profile';

// Define a new interface for the profile-related methods
interface Profile {
  update(userId: string, cid: string): Promise<any>;
  getByAddress(address: `0x${string}`): Promise<any>;
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
    expirationDate: string): Promise<ClientTransactionResponse>;

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
  approve(serviceId: string, proposalId: string, metaEvidenceCid: string, value?: bigint): Promise<ClientTransactionResponse>
  release(serviceId: string, amount: bigint, userId: number): Promise<any>
  reimburse(serviceId: string, amount: bigint, userId: number): Promise<any>
}

interface ERC20 {
  balanceOf(tokenAddress: `0x${string}`): Promise<any>;
  checkAllowance(tokenAddress: `0x${string}`): Promise<any>;
  approve(tokenAddress: `0x${string}`, amount: bigint): Promise<any>;
}

// TODO: replace any here with the right type;
export class TalentLayerClient {
  graphQlClient: GraphQLClient
  ipfsClient: IPFSClient
  viemClient: ViemClient
  platformID: number;
  static readonly PUBLIC_SIGNATURE_API_URL: string = "https://api.defender.openzeppelin.com/autotasks/4b1688f9-01a4-435d-89ae-d05e0aa0a53b/runs/webhook/b9818d77-3c43-4c3d-bfb8-4c77036de92f/ACXhXsQoCKP8zZVE26gFbh";

  constructor(config: TalentLayerClientConfig) {
    this.platformID = config.platformId
    this.graphQlClient = new GraphQLClient(getGraphQLConfig(config.chainId))

    this.ipfsClient = new IPFSClient({ infuraClientId: config.infuraClientId, infuraClientSecret: config.infuraClientSecret });
    console.log("SDK: client initialising: ");

    this.viemClient = new ViemClient(config.walletConfig || {});

  }

  static async getSignature(method: string, args: Record<string, any>) {
    const res = await axios.post(TalentLayerClient.PUBLIC_SIGNATURE_API_URL, {
      method,
      args,
    });

    return JSON.parse(res.data.result);
  }

  // TODO: move these static functions to service class
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

  public erc20: ERC20 = {
    balanceOf: async (tokenAddress: `0x${string}`): Promise<any> => {
      const [address] = await this.viemClient.client.getAddresses();

      const balance: any = await this.viemClient.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20.abi,
        functionName: 'balanceOf',
        args: [address]
      });

      return balance;
    },

    checkAllowance: async (tokenAddress: `0x${string}`): Promise<any> => {
      const [address] = await this.viemClient.client.getAddresses();

      const allowance: any = await this.viemClient.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20.abi,
        functionName: 'allowance',
        args: [address, contracts.talentLayerEscrow.address],
      });

      return allowance;
    },

    approve: async (tokenAddress: `0x${string}`, amount: bigint): Promise<any> => {
      const [address] = await this.viemClient.client.getAddresses();

      const approval: any = await this.viemClient.client.writeContract({
        address: tokenAddress,
        abi: ERC20.abi,
        functionName: 'approve',
        account: address,
        args: [contracts.talentLayerEscrow.address, amount],
      });

      return approval;
    }
  }

  public proposal: Proposal = {
    getOne: async (proposalId: string) => {

      const serviceId = proposalId.split('-')[0];

      if (!serviceId) {
        throw Error("Proposal ID not valid");
      };

      const query = `
      {
        proposals(where: {service_: {id: ${serviceId}}}) {
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
      expirationDate: string
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
          this.platformID,
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

  // public service: IService = new Service(this.graphQlClient, this.ipfsClient, this.viemClient);

  get service(): IService {
    return new Service(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID
    );
  }

  get profile(): IProfile {
    return new Profile(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID
    )
  }

  get review(): IReview {
    return new Review(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID
    );
  }

  public escrow: Escrow = {
    approve: async (serviceId: string, proposalId: string, metaEvidenceCid: string, value?: bigint): Promise<ClientTransactionResponse> => {

      const proposal = await this.proposal.getOne(proposalId);

      if (!proposal) {
        throw new Error("Proposal not found");
      }

      if (!proposal.cid) {
        throw new Error("Proposal cid not found");
      }

      const sellerId: string = proposal.seller.id;

      let tx, cid = proposal.cid;

      if (proposal.rateToken = RateToken.NATIVE) {
        tx = await this.viemClient.writeContract(
          "talentLayerEscrow",
          "createTransaction",
          [
            parseInt(serviceId, 10),
            parseInt(sellerId, 10),
            metaEvidenceCid,
            cid
          ],
          value
        )
      } else {
        tx = await this.viemClient.writeContract(
          "talentLayerEscrow",
          "createTransaction",
          [
            parseInt(serviceId, 10),
            parseInt(sellerId, 10),
            metaEvidenceCid,
            cid
          ]
        )
      }

      if (tx) {
        return { tx, cid: proposal.cid }
      }

      throw new Error("Error creating Transaction");
    },

    release: async (serviceId: string, amount: bigint, userId: number): Promise<any> => {

      const service = await this.service.getOne(serviceId);
      const transactionId = service?.transaction?.id;

      if (!transactionId) {
        throw new Error("service transaction not found")
      }

      if (!transactionId) {
        throw new Error("Transaction Id not found for service");
      }

      const tx = await this.viemClient.writeContract(
        "talentLayerEscrow",
        "release",
        [
          userId,
          parseInt(transactionId),
          amount.toString()
        ]
      )

      return tx;
    },

    reimburse: async (serviceId: string, amount: bigint, userId: number): Promise<any> => {

      const service = await this.service.getOne(serviceId);
      const transactionId = service?.transaction?.id;

      if (!transactionId) {
        throw new Error("service transaction not found")
      }

      if (!transactionId) {
        throw new Error("Transaction Id not found for service");
      }

      const tx = await this.viemClient.writeContract(
        "talentLayerEscrow",
        "reimburse",
        [
          userId,
          parseInt(transactionId),
          amount.toString()
        ]
      )

      return tx;
    }
  }

  // IPFS Functions

  public async upploadProposalDataToIpfs(proposalDetails: ProposalDetails) {
    if (this.ipfsClient) {
      return this.ipfsClient.post(JSON.stringify(proposalDetails));
    }
  }

  // TODO: move these functions to Service class
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