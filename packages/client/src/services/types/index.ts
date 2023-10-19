import { ServiceStatusEnum } from '../enums';

export type ServiceDetails = {
  title: string;
  about: string;
  keywords: string;
  rateToken: string;
  rateAmount: string;
  [key: string]: any;
};

export interface ICreateServiceSignature {
  profileId: number;
  cid: string;
}

export interface IProps {
  serviceStatus?: ServiceStatusEnum;
  buyerId?: string;
  sellerId?: string;
  numberPerPage?: number;
  offset?: number;
  searchQuery?: string;
  platformId?: string;
}
