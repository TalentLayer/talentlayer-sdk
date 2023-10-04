export function getReviewsByService(serviceId: string) {
  const query = `
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
  return query;
}
