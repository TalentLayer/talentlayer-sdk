export const serviceQueryFields = `
  id
  status
  createdAt
  cid
  referralAmount
  referrer {
    address
    handle
    id
  }
  rateToken {
    address
    decimals
    name
    symbol
  }
  transaction {
    id
  }
  buyer {
    id
    handle
    address
    rating
    userStat {
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
  keywords_raw
  keywords {
    id
  }
`;

export const getProposalsByService = (serviceId: string) => `
{
  proposals(where: {service_: {id: ${serviceId}}}) {
    id
    seller {
      id
      handle
      address
      cid
      rating
      userStat {
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
    referrer {
      address
      handle
      id
    }
    status
    expirationDate
  }
}
`;
