import { ServiceStatusEnum } from '../enums';
import {ClientTransactionResponse} from "../../types";

export interface IService {
  getOne(id: string): Promise<any>;
  create(
      serviceDetails: ServiceDetails,
      userId: string,
      platformId: number,
      token: string,
      referralAmount?: number,
  ): Promise<ClientTransactionResponse>;
  update(
      serviceDetails: ServiceDetails,
      userId: string,
      serviceId: number,
      referralAmount?: number,
  ): Promise<ClientTransactionResponse>;
  updloadServiceDataToIpfs(serviceData: ServiceDetails): Promise<string>;
  getServices(params: IProps): Promise<any>;
  search(params: IProps): Promise<any>;
}

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
