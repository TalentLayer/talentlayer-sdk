import { serviceDescriptionQueryFields, serviceQueryFields } from '../../graphql';
import { IProps } from '../types';

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

export const getOne = (id: string) => (`
{
  service(id: "${id}") {
    ${serviceQueryFields}
    description {
      ${serviceDescriptionQueryFields}
    }
  }
}
`)

export const getServices = (params: IProps) => {
  const pagination = params.numberPerPage
    ? 'first: ' + params.numberPerPage + ', skip: ' + params.offset
    : '';

  const query = `
  {
    services(orderBy: id, orderDirection: desc ${pagination} ${getFilteredServiceCondition(
    params,
  )}) {
      ${serviceQueryFields}
      description {
        ${serviceDescriptionQueryFields}
      }
    }
  }`;

  return query;
}

export const searchServices = (params: IProps) => {
  const pagination = params.numberPerPage
    ? 'first: ' + params.numberPerPage + ' skip: ' + params.offset
    : '';

  const query = `
            {
              serviceDescriptionSearchRank(
                text: "${params.searchQuery}",
                orderBy: id orderDirection: desc ${pagination} ${getFilteredServiceDescriptionCondition(
    params,
  )}
              ){
                ${serviceDescriptionQueryFields}
                service {
                  ${serviceQueryFields}
                }
              }
            }`;

  return query;
}