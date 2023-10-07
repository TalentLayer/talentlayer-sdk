import GraphQLClient from "../graphql";
import IPFSClient from "../ipfs";
import { ClientTransactionResponse, ReviewDetails } from "../types";
import { ViemClient } from "../viem";

export interface IReview {
  create(
    data: ReviewDetails,
    serviceId: string,
    userId: string,
  ): Promise<ClientTransactionResponse>;
}

export class Review {
  graphQlClient: GraphQLClient;
  ipfsClient: IPFSClient;
  viemClient: ViemClient;
  platformId: number;

  static CREATE_ERROR = "unable to submit review";

  constructor(
    graphQlClient: GraphQLClient,
    ipfsClient: IPFSClient,
    viemClient: ViemClient,
    platformId: number,
  ) {
    this.graphQlClient = graphQlClient;
    this.platformId = platformId;

    this.ipfsClient = ipfsClient;

    this.viemClient = viemClient;
  }

  public async uploadReviewDataToIpfs(data: ReviewDetails): Promise<string> {
    if (this.ipfsClient) {
      return this.ipfsClient.post(JSON.stringify(data));
    }

    throw new Error(IPFSClient.IPFS_CLIENT_ERROR);
  }

  public async create(
    data: ReviewDetails,
    serviceId: string,
    userId: string,
  ): Promise<ClientTransactionResponse> {
    console.log("SDK: creating review");
    const cid = await this.uploadReviewDataToIpfs(data);

    const tx = await this.viemClient.writeContract(
      "talentLayerReview",
      "mint",
      [userId, serviceId, cid, data.rating],
    );

    if (cid && tx) {
      return { cid, tx };
    }

    throw new Error(Review.CREATE_ERROR);
  }
}
