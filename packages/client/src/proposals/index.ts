import GraphQLClient from '../graphql';
import IPFSClient from '../ipfs';
import { Platform } from '../platform';
import { ClientTransactionResponse } from '../types';
import { getSignature } from '../utils/signature';
import { ViemClient } from '../viem';
import { getAllProposalsByServiceId, getAllProposalsByUser, getProposalById } from './graphql';
import { CreateProposalArgs, IProposal, ProposalDetails } from './types';

export class Proposal implements IProposal {
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
    console.log('SDK: proposal initialising: ');
    this.graphQlClient = graphQlClient;
    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.signatureApiUrl = signatureApiUrl;
  }

  public async getOne(proposalId: string): Promise<any> {
    const query = getProposalById(proposalId);

    const response = await this.graphQlClient.get(query);

    if (response?.data?.proposal) {
      return response?.data?.proposal;
    }
    return null;
  }

  public async getByServiceId(serviceId: string): Promise<any> {
    const query = getAllProposalsByServiceId(serviceId)

    const response = await this.graphQlClient.get(query);

    return response?.data?.proposals || null
  }

  public async getByUser(userId: string): Promise<any> {
    const query = getAllProposalsByUser(userId)

    const response = await this.graphQlClient.get(query);

    return response?.data?.proposals || null
  }

  public async getSignature(args: CreateProposalArgs): Promise<any> {
    return getSignature('createProposal', args, this.signatureApiUrl);
  }

  public async upload(proposalDetails: ProposalDetails): Promise<string> {
    return this.ipfsClient.post(JSON.stringify(proposalDetails));
  }

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
