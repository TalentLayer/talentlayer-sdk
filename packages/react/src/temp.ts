import { TalentLayerClient } from "../../client/src";

const platformFields = `
    id
    address
    name
    createdAt
    updatedAt
    feePayments
    totalPlatformGains
    feeClaims
    originServiceFeeRate
    originValidatedProposalFeeRate
    servicePostingFee
    proposalPostingFee
    arbitrator
    arbitratorExtraData
    arbitrationFeeTimeout
    cid
    description
    signer
`;

const platformDescriptionFields = `
    id
    about
    website
    platform
    video_url
    image_url
`;

export function getPlatform(
  tlClient: TalentLayerClient,
  id: string
): Promise<any> {
  const query = `
    {
      platform(id: ${id}) {
        ${platformFields}
        description {
          ${platformDescriptionFields}
        }
      }
    }
    `;
  return tlClient.graphQlClient.getFromSubgraph(query);
}
