import { IProps } from '../types';

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

export const getFilteredServiceDescriptionCondition = (params: IProps): string => {
  let condition = ', where: {';
  condition += params.serviceStatus ? `service_: {status:"${params.serviceStatus}"}` : '';
  condition += params.buyerId ? `, buyer: "${params.buyerId}"` : '';
  condition += params.sellerId ? `, seller: "${params.sellerId}"` : '';
  condition += params.platformId ? `, platform: "${params.platformId}"` : '';
  condition += '}';
  return condition === ', where: {}' ? '' : condition;
};

export const getFilteredServiceCondition = (params: IProps): string => {
  let condition = ', where: {';
  condition += params.serviceStatus ? `status: "${params.serviceStatus}"` : '';
  condition += params.buyerId ? `, buyer: "${params.buyerId}"` : '';
  condition += params.sellerId ? `, seller: "${params.sellerId}"` : '';
  condition += params.platformId ? `, platform: "${params.platformId}"` : '';
  condition += '}';
  return condition === ', where: {}' ? '' : condition;
};
