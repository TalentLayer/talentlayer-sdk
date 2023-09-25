import { TalentLayerClient } from "..";
import GraphQLClient, { serviceDescriptionQueryFields, serviceQueryFields } from "../graphql";
import IPFSClient from "../ipfs";
import { ClientTransactionResponse, ICreateServiceSignature, ServiceDetails } from "../types";
import { ViemClient } from "../viem";

export interface IService {
    getOne(id: string): Promise<any>;
    create(serviceDetails: ServiceDetails, userId: string, platformId: number): Promise<ClientTransactionResponse>;
    updloadServiceDataToIpfs(serviceData: ServiceDetails): Promise<string>
}

export class Service {
    graphQlClient: GraphQLClient;
    ipfsClient?: IPFSClient;
    viemClient: ViemClient;
    platformID: number;

    constructor(graphQlClient: GraphQLClient, ipfsClient: IPFSClient, viemClient: ViemClient, platformId: number) {
        this.graphQlClient = graphQlClient;
        this.platformID = platformId;
        console.log("SDK: service initialising: ");
        if (ipfsClient) {
            this.ipfsClient = ipfsClient
        }
        this.viemClient = viemClient;

    }

    static async getServiceSignature(args: ICreateServiceSignature) {
        return TalentLayerClient.getSignature('createService', args);
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

        const response = await this.graphQlClient.getFromSubgraph(query);

        return response?.data?.service || {};
    }

    public async updloadServiceDataToIpfs(serviceData: ServiceDetails): Promise<string> {
        if (this.ipfsClient) {
            return this.ipfsClient.post(JSON.stringify(serviceData));
        }

        throw new Error(IPFSClient.IPFS_CLIENT_ERROR);
    }

    public async create(serviceDetails: ServiceDetails, userId: string, platformId: number): Promise<ClientTransactionResponse> {

        const cid = await this.updloadServiceDataToIpfs(serviceDetails);
        const signature = await Service.getServiceSignature({ profileId: Number(userId), cid })

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
}