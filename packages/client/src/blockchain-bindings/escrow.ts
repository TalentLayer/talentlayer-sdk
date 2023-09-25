import GraphQLClient from "../graphql";
import IPFSClient from "../ipfs";
import { ClientTransactionResponse, RateToken } from "../types";
import { ViemClient } from "../viem";
import { Proposal } from "./proposal";
import { Service } from "./service";

export interface IEscrow {
    approve(serviceId: string, proposalId: string, metaEvidenceCid: string, value?: bigint): Promise<ClientTransactionResponse>
    release(serviceId: string, amount: bigint, userId: number): Promise<any>
    reimburse(serviceId: string, amount: bigint, userId: number): Promise<any>
}

export class Escrow {
    graphQlClient: GraphQLClient;
    ipfsClient: IPFSClient;
    viemClient: ViemClient;
    platformID: number;

    constructor(graphQlClient: GraphQLClient, ipfsClient: IPFSClient, viemClient: ViemClient, platformId: number) {
        console.log("SDK: escrow initialising: ");
        this.graphQlClient = graphQlClient;
        this.platformID = platformId;
        this.ipfsClient = ipfsClient
        this.viemClient = viemClient;

    }

    public async approve(serviceId: string, proposalId: string, metaEvidenceCid: string, value?: bigint): Promise<ClientTransactionResponse> {

        const proposalInstance = new Proposal(this.graphQlClient, this.ipfsClient, this.viemClient, this.platformID);
        const proposal = await proposalInstance.getOne(proposalId);

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
    }

    public async release(serviceId: string, amount: bigint, userId: number): Promise<any> {

        const serviceInstance = new Service(this.graphQlClient, this.ipfsClient, this.viemClient, this.platformID);
        const service = await serviceInstance.getOne(serviceId);
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
    }

    public async reimburse(serviceId: string, amount: bigint, userId: number): Promise<any> {
        const serviceInstance = new Service(this.graphQlClient, this.ipfsClient, this.viemClient, this.platformID);
        const service = await serviceInstance.getOne(serviceId);
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
        );

        return tx;
    }

}