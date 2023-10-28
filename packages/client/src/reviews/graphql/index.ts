export const getReviewsByService = (serviceId: string) => `
{
  reviews(where: { service: "${serviceId}" }, orderBy: id, orderDirection: desc) {
    id
    rating
    createdAt
    service {
      id
      status
    }
    to {
      id
      handle
    }
    description{
      id
      content
    }
  }
}
`;
