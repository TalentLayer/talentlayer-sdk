export function getPaymentsByService(serviceId: string, paymentType?: string) {
  let condition = `where: {service: "${serviceId}"`;
  paymentType ? (condition += `, paymentType: "${paymentType}"`) : '';
  condition += '}, orderBy: id, orderDirection: asc';
  const query = `
    {
      payments(${condition}) {
        id
        amount
        rateToken {
          address
          decimals
          name
          symbol
        }
        paymentType
        transactionHash
        createdAt
      }
    }
    `;
  return query;
}

export function getPaymentsForUser(
  userId: string,
  numberPerPage?: number,
  offset?: number,
  startDate?: string,
  endDate?: string,
) {
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
}
