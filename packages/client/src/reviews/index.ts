import GraphQLClient from '../graphql';
import IPFSClient from '../ipfs';
import { ClientTransactionResponse } from '../types';
import { ViemClient } from '../viem';
import { getReviewsByService } from './graphql';
import { ReviewDetails } from './types';

export class Review {
  /** @hidden */
  graphQlClient: GraphQLClient;
  /** @hidden */
  ipfsClient: IPFSClient;
  /** @hidden */
  viemClient: ViemClient;
  /** @hidden */
  platformId: number;

  /** @hidden */
  static CREATE_ERROR = 'unable to submit review';

  /** @hidden */
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

  /**
 * Uploads review data to IPFS and returns the CID. This function is called during review creation
 * @param {ReviewDetails} data - The review data to be uploaded.
 * @returns {Promise<string>} - A promise that resolves to the CID of the uploaded review data.
 */
  public async uploadReviewDataToIpfs(data: ReviewDetails): Promise<string> {
    if (this.ipfsClient) {
      return this.ipfsClient.post(JSON.stringify(data));
    }

    throw new Error(IPFSClient.IPFS_CLIENT_ERROR);
  }

  /**
 * Creates a new review with the given details for a service.
 * @param {ReviewDetails} data - The details of the review to be created.
 * @param {string} serviceId - The service ID associated with the review.
 * @param {string} userId - The user ID of the user creating the review.
 * @returns {Promise<ClientTransactionResponse>} - A promise that resolves to the transaction response for the review creation. Includes the CID of the review data and the transaction hash.
 * @throws {Error} - Throws an error if unable to submit the review.
 */
  public async create(
    data: ReviewDetails,
    serviceId: string,
    userId: string,
  ): Promise<ClientTransactionResponse> {
    console.log('SDK: creating review');
    const cid = await this.uploadReviewDataToIpfs(data);

    const tx = await this.viemClient.writeContract('talentLayerReview', 'mint', [
      userId,
      serviceId,
      cid,
      data.rating,
    ]);

    if (cid && tx) {
      return { cid, tx };
    }

    throw new Error(Review.CREATE_ERROR);
  }

  /**
 * Retrieves all reviews associated with a specific service ID.
 * @param {string} serviceId - The unique identifier of the service.
 * @returns {Promise<any>} - A promise that resolves to the reviews related to the specified service.
 */
  public async getByService(serviceId: string): Promise<any> {
    const query = getReviewsByService(serviceId);

    const response = await this.graphQlClient.get(query);

    return response?.data || null;
  }
}
