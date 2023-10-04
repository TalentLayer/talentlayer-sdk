export function getUsers(numberPerPage?: number, offset?: number, searchQuery?: string) {
  const pagination = numberPerPage ? 'first: ' + numberPerPage + ', skip: ' + offset : '';
  let condition = ', where: {';
  condition += searchQuery ? `, handle_contains_nocase: "${searchQuery}"` : '';
  condition += '}';

  const query = `
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
  return query;
}

export function getUserById(id: string) {
  const query = `
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
  return query;
}

export function getUserByAddress(address: string) {
  const query = `
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
  return query;
}

export function getUserTotalGains(id: string) {
  const query = `
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
  return query;
}

export function getUserByIds(ids: string[]) {
  const query = `
    {
      users(where: {id_in: [${ids.join(',')}]}) {
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
  return query;
}
