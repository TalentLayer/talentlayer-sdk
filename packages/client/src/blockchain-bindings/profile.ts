import GraphQLClient from "../graphql";
import IPFSClient from "../ipfs";
import { getProtocolById } from "../platform/graphql/queries";
import { ClientTransactionResponse, TalentLayerProfile } from "../types";
import { ViemClient } from "../viem";

export interface IProfile {
  upload(profileData: TalentLayerProfile): Promise<string>;
  getByAddress(address: `0x${string}`): Promise<any>;
  create(handle: string): Promise<any>;
  update(
    profileDta: TalentLayerProfile,
    userId: string,
  ): Promise<ClientTransactionResponse>;
}

export class Profile {
  graphQlClient: GraphQLClient;
  ipfsClient: IPFSClient;
  viemClient: ViemClient;
  platformId: number;

  static CREATE_ERROR = "unable to create profile";
  static UPDATE_ERROR = "unable to update profile";

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

  public async getByAddress(address: `0x${string}`): Promise<any> {
    const query = `
      {
        users(where: {address: "${address.toLocaleLowerCase()}"}, first: 1) {
          id
          address
          handle
          rating
          delegates
          userStats {
            numReceivedReviews
          }
          updatedAt
          createdAt
          description {
            about
            role
            name
            country
            headline
            id
            image_url
            video_url
            title
            timezone
            skills_raw
          }
        }
      }
      `;

    const response = await this.graphQlClient.get(query);

    if (
      response &&
      response?.data?.users &&
      Array.isArray(response?.data?.users)
    ) {
      return response?.data?.users[0];
    }

    return null;
  }

  public async upload(profileData: TalentLayerProfile): Promise<string> {
    return this.ipfsClient.post(JSON.stringify(profileData));
  }

  public async update(
    profileDta: TalentLayerProfile,
    userId: string,
  ): Promise<ClientTransactionResponse> {
    console.log("SDK: updating profile");
    const cid = await this.upload(profileDta);

    const tx = await this.viemClient.writeContract(
      "talentLayerId",
      "updateProfileData",
      [userId, cid],
    );

    if (cid && tx) {
      return { cid, tx };
    }

    throw new Error(Profile.UPDATE_ERROR);
  }

  public async create(handle: string): Promise<any> {
    const proposolResponse = await this.graphQlClient.get(getProtocolById(1));

    const protocol = proposolResponse?.data?.protocol;

    console.log("SDK: protocol", protocol);

    if (!protocol?.id) {
      throw new Error("Protocol not found");
    }

    const fee: string = protocol.userMintFee;

    console.log("SDK: protocol fee", this.platformId, fee, handle);

    console.log("SDK: creating profile");
    return this.viemClient.writeContract(
      "talentLayerId",
      "mint",
      [this.platformId.toString(), handle],
      BigInt(fee),
    );
  }
}
