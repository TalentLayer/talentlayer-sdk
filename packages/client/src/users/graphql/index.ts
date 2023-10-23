export const getUsers = (
  numberPerPage?: number,
  offset?: number,
  searchQuery?: string
) => {
  const pagination = numberPerPage
    ? "first: " + numberPerPage + ", skip: " + offset
    : "";
  let condition = ", where: {";
  condition += searchQuery ? `, handle_contains_nocase: "${searchQuery}"` : "";
  condition += "}";

  return `
        {
          users(orderBy: rating, orderDirection: desc ${pagination} ${condition}) {
            id
            address
            handle
            userStats {
              numReceivedReviews
            }
            rating
          }
        }
        `;
};

export const getUserById = (id: string) => `
{
    user(id: "${id}") {
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
        web3mailPreferences{
        activeOnNewService
        activeOnNewProposal
        activeOnProposalValidated
        activeOnFundRelease
        activeOnReview
        activeOnPlatformMarketing
        activeOnProtocolMarketing
        }
    }
    }
}
`;

export const getUserByAddress = (address: string) => `
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
        web3mailPreferences{
        activeOnNewService
        activeOnNewProposal
        activeOnProposalValidated
        activeOnFundRelease
        activeOnReview
        activeOnPlatformMarketing
        activeOnProtocolMarketing
        }
    }
    }
}
`;

export const getUserTotalGains = (id: string) => `
{
    user(id: "${id}") {
    totalGains{
        id
        totalGain
        token {
        id
        name
        symbol
        decimals
        }
    }
    }
}
`;

