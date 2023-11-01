import { ClientTransactionResponse } from '../../types';

export type TalentLayerProfile = {
  title?: string;
  role?: string;
  image_url?: string;
  video_url?: string;
  name?: string;
  about?: string;
  skills?: string;
  [key: string]: any;
};

export interface IProfile {
  upload(profileData: TalentLayerProfile): Promise<string>;
  getByAddress(address: `0x${string}`): Promise<any>;
  getById(userId: string): Promise<any>;
  create(handle: string): Promise<any>;
  update(profileData: TalentLayerProfile, userId: string): Promise<ClientTransactionResponse>;
  getBy(params: {
    numberPerPage?: number;
    offset?: number;
    searchQuery?: string;
  }): Promise<any>;
  getTotalGains(userId: string): Promise<any>;
  getPayments(userId: string, numberPerPage?: number, offset?: number, startDate?: string, endDate?: string): Promise<any>
  getMintFees(): Promise<any>;
}
