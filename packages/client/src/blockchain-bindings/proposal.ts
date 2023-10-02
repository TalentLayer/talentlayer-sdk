import { TalentLayerClient } from "..";
import GraphQLClient, { getProposalsByService } from "../graphql";
import IPFSClient from "../ipfs";
import { ClientTransactionResponse, CreateProposalArgs, ProposalDetails } from "../types";
import { ViemClient } from "../viem";

export interface IProposal {
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
    ): Promise<ClientTransactionResponse>;

    upload(proposalDetails: ProposalDetails): Promise<string>;
}

export class Proposal {
    graphQlClient: GraphQLClient;
    ipfsClient: IPFSClient;
    viemClient: ViemClient;
    platformID: number;

    constructor(graphQlClient: GraphQLClient, ipfsClient: IPFSClient, viemClient: ViemClient, platformId: number) {
        console.log("SDK: proposal initialising: ");
        this.graphQlClient = graphQlClient;
        this.platformID = platformId;
        this.ipfsClient = ipfsClient
        this.viemClient = viemClient;
    }

    public async getOne(proposalId: string): Promise<any> {

        const serviceId = proposalId.split('-')[0];

        if (!serviceId) {
            throw Error("Proposal ID not valid");
        };

        const query = getProposalsByService(serviceId);

        const response = await this.graphQlClient.get(query);
        if (Array.isArray(response?.data?.proposals) && response?.data?.proposals?.length > 0) {
            return response?.data?.proposals[0];
        }
        return null;
    }

    public async getSignature(args: CreateProposalArgs): Promise<any> {
        return TalentLayerClient.getSignature('createProposal', args);
    }

    public async upload(proposalDetails: ProposalDetails): Promise<string> {

        return this.ipfsClient.post(JSON.stringify(proposalDetails));

    }

    public async create(
        proposalDetails: ProposalDetails,
        userId: string,
        serviceId: string,
        rateToken: string,
        rateAmount: string,
        expirationDate: string
    ): Promise<ClientTransactionResponse> {
        const cid = await this.upload(proposalDetails);
        const signature = await this.getSignature({ profileId: Number(userId), serviceId: Number(serviceId), cid })

        const tx = await this.viemClient.writeContract(
            'talentLayerService',
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

    }

    public async update(
        proposalDetails: ProposalDetails,
        userId: string,
        serviceId: string,
        rateToken: string,
        rateAmount: string,
        expirationDate: string
    ): Promise<ClientTransactionResponse> {
        const cid = await this.upload(proposalDetails);
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