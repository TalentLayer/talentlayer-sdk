import { ClientTransactionResponse } from '../../types';

export type ReviewDetails = {
  content: string;
  rating: number;
  [key: string]: any;
};

export interface IReview {
  create(
    data: ReviewDetails,
    serviceId: string,
    userId: string,
  ): Promise<ClientTransactionResponse>;
}
