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

export function getPlatform(id: string) {
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
  return query;
}

export function getPlatformsByOwner(addressOwner: string) {
  const query = `
    {
      platforms(where: {address: "${addressOwner}"}) {
        ${platformFields}
        description {
          ${platformDescriptionFields}
        }
      }
    }
    `;
  return query;
}
