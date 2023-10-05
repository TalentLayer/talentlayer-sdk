export const serviceQueryFields = `
  id
  status
  createdAt
  cid
  transaction {
    id
  }
  buyer {
    id
    handle
    address
    rating
    userStats {
      numReceivedReviews
    }
  }
  seller {
    id
    handle
  }
  proposals {
    id
  }
  validatedProposal: proposals(where: {status: "Validated"}){
    id,
    rateToken {
      address
      decimals
      name
      symbol
    },
    rateAmount,
  }
`;


export const serviceDescriptionQueryFields = `
  id
  title
  video_url
  about
  startDate
  expectedEndDate
  rateAmount
  rateToken
  keywords_raw
  keywords {
    id
  }
`;

export const getProposalsByService = (serviceId: string) => (`
{
  proposals(where: {service_: {id: ${serviceId}}}) {
    id
    seller {
      id
      handle
      address
      cid
      rating
      userStats {
        numReceivedReviews
      }
    }
    service {
      id
    }
    cid
    rateToken {
      address
    }
    rateAmount
    description {
      about
      video_url
    }
    status
    expirationDate
  }
}
`)


export const getProposalById = (id: string) => (`
{
  proposal(id: "${id}") {
    id
    seller {
      id
      handle
      address
      cid
      rating
      userStats {
        numReceivedReviews
      }
    }
    platform {
      id
    }
    service {
      id
      platform {
        id
      }
    }
    cid
    rateToken {
      address
    }
    rateAmount
    description {
      about
      video_url
    }
    status
    expirationDate
  }
}
`)


export const getProtocolAndPlatformsFees = (
  chainId: number,
  originServicePlatformId: string,
  originValidatedProposalPlatformId: string,
): string => (`
  {
    protocols {
      protocolEscrowFeeRate
    }
    servicePlatform: platform(id:${originServicePlatformId}){
      originServiceFeeRate
    }
    proposalPlatform: platform(id:${originValidatedProposalPlatformId}){
      originValidatedProposalFeeRate
    }
  }
`);