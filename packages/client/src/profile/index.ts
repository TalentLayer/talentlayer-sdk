import { Hash } from 'viem';
import GraphQLClient from '../graphql';
import IPFSClient from '../ipfs';
import { getProtocolById } from '../platform/graphql/queries';
import { ClientTransactionResponse } from '../types';
import { ViemClient } from '../viem';
import { getMintFees, getPaymentsForUser, getProfileByAddress, getProfileById, getProfiles, getUserTotalGains } from './graphql';
import { TalentLayerProfile } from './types';

export class Profile {
  /** @hidden */
  graphQlClient: GraphQLClient;
  /** @hidden */
  ipfsClient: IPFSClient;
  /** @hidden */
  viemClient: ViemClient;
  /** @hidden */
  platformId: number;

  /** @hidden */
  static CREATE_ERROR = 'unable to create profile';
  /** @hidden */
  static UPDATE_ERROR = 'unable to update profile';

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
 * getByAddress - Retrieves a user's profile based on their address.
 * @param {Hash} address - The address of the user whose profile is being requested.
 * @returns {Promise<any>} - A promise that resolves to the user's profile data, or null if no profile is found.
 */
  public async getByAddress(address: Hash): Promise<any> {
    const response = await this.graphQlClient.get(getProfileByAddress(address));

    if (response && response?.data?.users && Array.isArray(response?.data?.users)) {
      return response?.data?.users[0];
    }

    return null;
  }

  /**
 * getById - Fetches a user's profile using their user ID. This is useful for retrieving profile information when the user ID is known, instead of the address
 * @param {string} userId - The id of the user whose profile is to be retrieved.
 * @returns {Promise<any>} - A promise that resolves to the user's profile data, or null if the profile does not exist.
 */
  public async getById(userId: string): Promise<any> {
    const query = getProfileById(userId);

    const response = await this.graphQlClient.get(query);

    return response?.data?.user || null;
  }

  /**
 * upload - Uploads profile data to IPFS and returns the resulting CID.
 * @param {TalentLayerProfile} profileData - The profile data to be uploaded.
 * @returns {Promise<string>} - A promise that resolves to the Content Identifier (CID) of the uploaded data on IPFS.
 */
  public async upload(profileData: TalentLayerProfile): Promise<string> {
    return this.ipfsClient.post(JSON.stringify(profileData));
  }

  /**
 * update - Updates the profile data of a user. This involves uploading new profile data to IPFS and writing the update transaction to the contract.
 * @param {TalentLayerProfile} profileData - The new profile data to be updated.
 * @param {string} userId - The unique identifier of the user whose profile is being updated.
 * @returns {Promise<ClientTransactionResponse>} - A promise that resolves to the transaction response, including the CID and transaction hash.
 */
  public async update(
    profileData: TalentLayerProfile,
    userId: string,
  ): Promise<ClientTransactionResponse> {
    console.log('SDK: updating profile');
    const cid = await this.upload(profileData);

    const tx = await this.viemClient.writeContract('talentLayerId', 'updateProfileData', [
      userId,
      cid,
    ]);

    if (cid && tx) {
      return { cid, tx };
    }

    throw new Error(Profile.UPDATE_ERROR);
  }

  /**
 * create - Creates a new user profile by minting it on the TalentLayerId contract. This function is typically called when a new user registers and a profile needs to be created in the system.
 * @param {string} handle - The user handle or username for the new profile.
 * @returns {Promise<Hash>} - A promise that resolves to the transaction hash once the profile creation transaction is completed.
 */
  public async create(handle: string): Promise<Hash> {
    const proposolResponse = await this.graphQlClient.get(getProtocolById(1));

    const protocol = proposolResponse?.data?.protocol;

    console.log('SDK: protocol', protocol);

    if (!protocol?.id) {
      throw new Error('Protocol not found');
    }

    const fee: string = protocol.userMintFee;

    console.log('SDK: protocol fee', this.platformId, fee, handle);

    console.log('SDK: creating profile');
    return this.viemClient.writeContract(
      'talentLayerId',
      'mint',
      [this.platformId.toString(), handle],
      BigInt(fee),
    );
  }

  /**
 * getBy - Retrieves profiles based on specified search criteria. This function is useful for fetching multiple profiles, for instance, when implementing search functionality.
 * @param {{ numberPerPage?: number; offset?: number; searchQuery?: string; }} params - The search parameters including pagination and search query.
 * @returns {Promise<any>} - A promise that resolves to the list of profiles matching the search criteria.
 */
  public async getBy(params: {
    numberPerPage?: number;
    offset?: number;
    searchQuery?: string;
  }): Promise<any> {
    const query = getProfiles(params.numberPerPage, params.offset, params.searchQuery);

    return this.graphQlClient.get(query);
  }

  /**
 * getTotalGains - Retrieves the total earnings of the user
 * @param {string} userId - The unique identifier of the user whose earnings are being queried.
 * @returns {Promise<any>} - A promise that resolves to the total earnings of the user.
 */
  public async getTotalGains(userId: string): Promise<any> {
    const query = getUserTotalGains(userId);

    const response = await this.graphQlClient.get(query);

    return response?.data?.user?.totalGains || null;
  }

  /**
 * getPayments - Fetches the payments received by the user
 * @param {string} userId - The user's unique identifier.
 * @param {number} [numberPerPage] - The number of payment records per page for pagination.
 * @param {number} [offset] - The offset for pagination.
 * @param {string} [startDate] - The start date for filtering the payment history.
 * @returns {Promise<any>} - A promise that resolves to the user's payment history.
 */
  public async getPayments(
    userId: string,
    numberPerPage?: number,
    offset?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<any> {
    const query = getPaymentsForUser(userId, numberPerPage, offset, startDate, endDate)

    const response = await this.graphQlClient.get(query);

    return response?.data?.payments || null
  }

  /**
 * getMintFees - Retrieves the current profile minting fees for the TalentLayer protocol
 * @returns {Promise<any>} - A promise that resolves to the minting fees data. Returns null if no data is found or in case of an error.
 */
  public async getMintFees(): Promise<any> {
    const query = getMintFees();

    const response = await this.graphQlClient.get(query);

    return response?.data || null;
  }
}
