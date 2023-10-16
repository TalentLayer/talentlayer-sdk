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
  create(handle: string): Promise<any>;
  update(profileData: TalentLayerProfile, userId: string): Promise<ClientTransactionResponse>;
}
