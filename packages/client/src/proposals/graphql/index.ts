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
