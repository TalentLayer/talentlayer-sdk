import { Hash } from 'viem';

export const getProfileByAddress = (address: Hash) =>
  `
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

export const getProfiles = (numberPerPage?: number, offset?: number, searchQuery?: string) => {
  const pagination = numberPerPage ? 'first: ' + numberPerPage + ', skip: ' + offset : '';
  let condition = ', where: {';
  condition += searchQuery ? `, handle_contains_nocase: "${searchQuery}"` : '';
  condition += '}';

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

export const getProfileById = (id: string) => `
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

export const getPaymentsForUser = (
  userId: string,
  numberPerPage?: number,
  offset?: number,
  startDate?: string,
  endDate?: string,
) => {
  const pagination = numberPerPage ? 'first: ' + numberPerPage + ', skip: ' + offset : '';

  const startDataCondition = startDate ? `, createdAt_gte: "${startDate}"` : '';
  const endDateCondition = endDate ? `, createdAt_lte: "${endDate}"` : '';

  const query = `
{
  payments(where: {
    service_: {seller: "${userId}"}
    ${startDataCondition}
    ${endDateCondition}
  }, 
  orderBy: createdAt orderDirection: desc ${pagination} ) {
    id, 
    rateToken {
      address
      decimals
      name
      symbol
    }
    amount
    transactionHash
    paymentType
    createdAt
    service {
      id, 
      cid
    }
  }
}
`;
  return query;
};

export const getMintFees = () => `
{
    protocols {
        userMintFee,
        shortHandlesMaxPrice
    }
}
`;