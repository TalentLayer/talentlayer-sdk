import GraphQLClient from '../graphql';
import IPFSClient from '../ipfs';
import { ViemClient } from '../viem';
import { getProtocolAndPlatformsFees } from './graphql';

export class Fees {
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
    this.graphQlClient = graphQlClient;
    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.signatureApiUrl = signatureApiUrl;
  }

  public async getMintFees(): Promise<any> {
    const query = `
        {
            protocols {
                userMintFee,
                shortHandlesMaxPrice
            }
        }
        `;

    const response = await this.graphQlClient.get(query);

    return response?.data || null;
  }

  public async getProtocolAndPlatformsFees(
    originServicePlatformId: string,
    originValidatedProposalPlatformId: string,
  ): Promise<any> {
    const query = getProtocolAndPlatformsFees(originServicePlatformId, originValidatedProposalPlatformId);

    const response = await this.graphQlClient.get(query);

    return response?.data || null;
  }
}
