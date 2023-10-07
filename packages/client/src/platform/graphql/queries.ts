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

export const getPlatformById = (id: string) =>
  `{
        platform(id: ${id}) {
          ${platformFields}
          description {
            ${platformDescriptionFields}
          }
        }
      }
      `;

export const getPlatformsByOwner = (address: `0x${string}`) =>
  `
    {
        platforms(where: {address: "${address}"}) {
          ${platformFields}
          description {
            ${platformDescriptionFields}
          }
        }
      }
    `;

export const getProtocolById = (id: number) =>
  `
  query Protocol {
    protocol(id: "${id}", subgraphError: "allow") {
        id
        userMintFee
        platformMintFee
        protocolEscrowFeeRate
        totalMintFees
        minArbitrationFeeTimeout
        shortHandlesMaxPrice
        minServiceCompletionPercentage
    }
  }
  `;
