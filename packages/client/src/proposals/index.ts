import GraphQLClient from '../graphql';
import IPFSClient from '../ipfs';
import { Platform } from '../platform';
import { ClientTransactionResponse } from '../types';
import { getSignature } from '../utils/signature';
import { ViemClient } from '../viem';
import { getAllProposalsByServiceId, getAllProposalsByUser, getProposalById } from './graphql';
import { CreateProposalArgs, IProposal, ProposalDetails } from './types';

/**
 * The sub module that deals with proposals associated to services on TalentLayer
 */
export class Proposal implements IProposal {
  /** @hidden */
  graphQlClient: GraphQLClient;
  /** @hidden */
  ipfsClient: IPFSClient;
  /** @hidden */
  viemClient: ViemClient;
  /** @hidden */
  platformID: number;
  /** @hidden */
  signatureApiUrl?: string;

  /** @hidden */
  constructor(
    graphQlClient: GraphQLClient,
    ipfsClient: IPFSClient,
    viemClient: ViemClient,
    platformId: number,
    signatureApiUrl?: string,
  ) {
    console.log('SDK: proposal initialising: ');
    this.graphQlClient = graphQlClient;
    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.signatureApiUrl = signatureApiUrl;
  }

  /**
 * Retrieves a specific proposal by its ID.
 * @param {string} proposalId - The unique identifier of the proposal.
 * @returns {Promise<any>} - A promise that resolves to the details of the proposal.
 */
  public async getOne(proposalId: string): Promise<any> {
    const query = getProposalById(proposalId);

    const response = await this.graphQlClient.get(query);

    if (response?.data?.proposal) {
      return response?.data?.proposal;
    }
    return null;
  }

  /**
 * Fetches all proposals associated with a specific service ID.
 * @param {string} serviceId - The unique identifier of the service.
 * @returns {Promise<any>} - A promise that resolves to a list of proposals related to the service.
 */
  public async getByServiceId(serviceId: string): Promise<any> {
    const query = getAllProposalsByServiceId(serviceId)

    const response = await this.graphQlClient.get(query);

    return response?.data?.proposals || null
  }

  /**
 * Retrieves all proposals created by a specific user ID.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<any>} - A promise that resolves to a list of proposals related to the user.
 */
  public async getByUser(userId: string): Promise<any> {
    const query = getAllProposalsByUser(userId)

    const response = await this.graphQlClient.get(query);

    return response?.data?.proposals || null
  }

  /**
 * Generates a signature for a proposal creation operation.
 * @param {CreateProposalArgs} args - The arguments required for creating the proposal signature.
 * @returns {Promise<any>} - A promise that resolves to the generated signature string.
 */

  public async getSignature(args: CreateProposalArgs): Promise<any> {
    return getSignature('createProposal', args, this.signatureApiUrl);
  }

  /**
 * Uploads proposal details to IPFS and returns the CID.
 * @param {ProposalDetails} proposalDetails - The details of the proposal to be uploaded.
 * @returns {Promise<string>} - A promise that resolves to the CID of the uploaded proposal data.
 */
  public async upload(proposalDetails: ProposalDetails): Promise<string> {
    return this.ipfsClient.post(JSON.stringify(proposalDetails));
  }

  /**
   * Creates a new proposal with the given details.
   * @param {ProposalDetails} proposalDetails - The details of the proposal to be created.
   * @param {string} userId - The user ID of the proposal creator.
   * @param {string} serviceId - The ID of the service for which the proposal is being created
   * @param {string} rateAmount - The amount/rate for which the proposal is being created
   * @param {string} expirationDate - The expiration date of the proposal.
   * @param {string} referrerId - The user ID of the referrer (default 0 if no referer).
   * @returns {Promise<ClientTransactionResponse>} - A promise that resolves to the transaction response for the proposal creation {cid and txHash}.
   */
  public async create(
      proposalDetails: ProposalDetails,
    userId: string,
    serviceId: string,
    rateAmount: string,
    expirationDate: string,
    referrerId: string = '0',
  ): Promise<ClientTransactionResponse> {
    const cid = await this.upload(proposalDetails);
    const signature = await this.getSignature({
      profileId: Number(userId),
      serviceId: Number(serviceId),
      cid,
    });

    const platform = new Platform(
      this.graphQlClient,
      this.viemClient,
      this.platformID,
      this.ipfsClient,
    );

    const platformDetails = await platform.getOne(this.platformID.toString());

    const proposalPostingFees = BigInt(platformDetails?.proposalPostingFee || '0');

    const tx = await this.viemClient.writeContract(
      'talentLayerService',
      'createProposal',
      [userId, serviceId, rateAmount, this.platformID, cid, expirationDate, signature, referrerId],
      proposalPostingFees,
    );

    if (cid && tx) {
      return { cid, tx };
    }

    throw new Error('Unable to create the proposal');
  }

  /**
 * Updates an existing proposal with new details.
 * This method is used to modify the attributes of a proposal, such as rate, expiration date, or other proposal-related details.
 * @param {ProposalDetails} proposalDetails - The updated details of the proposal.
 * @param {string} userId - The user ID of the individual updating the proposal.
 * @param {string} serviceId - The service ID associated with the proposal.
 * @param {string} rateAmount - The new amount/rate associated with the proposal.
 * @param {string} expirationDate - The new expiration date of the proposal.
 * @param {string} referrerId - The user ID of the referrer (default 0 if no referer).
 * @returns {Promise<ClientTransactionResponse>} - A promise that resolves to the transaction response for the proposal update. Includes the CID of the updated proposal data and the transaction hash.
 */
  public async update(
    proposalDetails: ProposalDetails,
    userId: string,
    serviceId: string,
    rateAmount: string,
    expirationDate: string,
    referrerId: string = '0',
  ): Promise<ClientTransactionResponse> {
    const cid = await this.upload(proposalDetails);
    const tx = await this.viemClient.writeContract('talentLayerService', 'updateProposal', [
      userId,
      serviceId,
      rateAmount,
      cid,
      expirationDate,
      referrerId,
    ]);

    if (cid && tx) {
      return { cid, tx };
    }

    throw new Error('Unable to update the proposal');
  }
}
