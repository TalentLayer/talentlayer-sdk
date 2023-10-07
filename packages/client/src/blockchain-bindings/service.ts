import GraphQLClient, {
  serviceDescriptionQueryFields,
  serviceQueryFields,
} from "../graphql";
import IPFSClient from "../ipfs";
import { getPlatformById } from "../platform/graphql/queries";
import {
  ClientTransactionResponse,
  ICreateServiceSignature,
  IProps,
  ServiceDetails,
} from "../types";
import { getSignature } from "../utils/signature";
import { ViemClient } from "../viem";

export interface IService {
  getOne(id: string): Promise<any>;
  create(
    serviceDetails: ServiceDetails,
    userId: string,
    platformId: number,
  ): Promise<ClientTransactionResponse>;
  updloadServiceDataToIpfs(serviceData: ServiceDetails): Promise<string>;
  getServices(params: IProps): Promise<any>;
  search(params: IProps): Promise<any>;
}

export class Service {
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
    console.log("SDK: service initialising: ");
    this.graphQlClient = graphQlClient;
    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.signatureApiUrl = signatureApiUrl;
  }

  static getFilteredServiceCondition(params: IProps): string {
    let condition = ", where: {";
    condition += params.serviceStatus
      ? `status: "${params.serviceStatus}"`
      : "";
    condition += params.buyerId ? `, buyer: "${params.buyerId}"` : "";
    condition += params.sellerId ? `, seller: "${params.sellerId}"` : "";
    condition += params.platformId ? `, platform: "${params.platformId}"` : "";
    condition += "}";
    return condition === ", where: {}" ? "" : condition;
  }

  static getFilteredServiceDescriptionCondition(params: IProps): string {
    let condition = ", where: {";
    condition += params.serviceStatus
      ? `service_: {status:"${params.serviceStatus}"}`
      : "";
    condition += params.buyerId ? `, buyer: "${params.buyerId}"` : "";
    condition += params.sellerId ? `, seller: "${params.sellerId}"` : "";
    condition += params.platformId ? `, platform: "${params.platformId}"` : "";
    condition += "}";
    return condition === ", where: {}" ? "" : condition;
  }

  public async getServiceSignature(args: ICreateServiceSignature) {
    return getSignature("createService", args, this.signatureApiUrl);
  }

  public async getOne(id: string): Promise<any> {
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

    const response = await this.graphQlClient.get(query);

    return response?.data?.service || {};
  }

  public async updloadServiceDataToIpfs(
    serviceData: ServiceDetails,
  ): Promise<string> {
    if (this.ipfsClient) {
      return this.ipfsClient.post(JSON.stringify(serviceData));
    }

    throw new Error(IPFSClient.IPFS_CLIENT_ERROR);
  }

  public async getServices(params: IProps): Promise<any> {
    const pagination = params.numberPerPage
      ? "first: " + params.numberPerPage + ", skip: " + params.offset
      : "";
    const query = `
          {
            services(orderBy: id, orderDirection: desc ${pagination} ${Service.getFilteredServiceCondition(
              params,
            )}) {
              ${serviceQueryFields}
              description {
                ${serviceDescriptionQueryFields}
              }
            }
          }`;

    return this.graphQlClient.get(query);
  }

  public async search(params: IProps): Promise<any> {
    const pagination = params.numberPerPage
      ? "first: " + params.numberPerPage + " skip: " + params.offset
      : "";
    const query = `
          {
            serviceDescriptionSearchRank(
              text: "${params.searchQuery}",
              orderBy: id orderDirection: desc ${pagination} ${Service.getFilteredServiceDescriptionCondition(
                params,
              )}
            ){
              ${serviceDescriptionQueryFields}
              service {
                ${serviceQueryFields}
              }
            }
          }`;
    return this.graphQlClient.get(query);
  }

  public async create(
    serviceDetails: ServiceDetails,
    userId: string,
    platformId: number,
  ): Promise<ClientTransactionResponse> {
    const platformDetailsResponse = await this.graphQlClient.get(
      getPlatformById(this.platformID.toString()),
    );

    let servicePostingFee =
      platformDetailsResponse?.data?.platform.servicePostingFee;
    servicePostingFee = BigInt(servicePostingFee || "0");

    const cid = await this.updloadServiceDataToIpfs(serviceDetails);
    const signature = await this.getServiceSignature({
      profileId: Number(userId),
      cid,
    });

    const tx = await this.viemClient.writeContract(
      "talentLayerService",
      "createService",
      [userId, platformId, cid, signature],
      servicePostingFee,
    );

    if (cid && tx) {
      return { cid, tx };
    }

    throw new Error("Unable to create service");
  }
}
