export const getProposalById = (id: string) => `
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
`;

export const getAllProposalsByServiceId = (id: string) => `
{
  proposals(where: {service_: {id: "${id}"}}) {
    service {
      id,
      cid
      buyer {
        id
      }
      platform {
        id
      }
    }
    cid
    id
    status
    rateToken {
      address
      decimals
      name
      symbol
    }
    rateAmount
    createdAt
    updatedAt
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
    description {
      id
      about
      expectedHours
      startDate
      video_url
    }
    expirationDate
    platform {
      id
    }
  }
}
`;

export const getAllProposalsByUser = (id: string) => `
  {
    proposals(where: {seller: "${id}", status: "Pending"}) {
      id
      rateAmount
      rateToken {
        address
        decimals
        name
        symbol
      }
      status
      cid
      createdAt
      seller {
        id
        handle
      }
      service {
        id
        cid
        createdAt
        buyer {
          id
          handle
        }
      }
      description {
        id
        about
        expectedHours
        startDate
        video_url
      }
      expirationDate
    }
  }
`;
