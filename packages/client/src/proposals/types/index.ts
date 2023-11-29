import { ClientTransactionResponse } from "../../types";

export type ProposalDetails = {
  about: string;
  video_url: string;
  [key: string]: any;
};

export interface CreateProposalArgs {
  profileId: number;
  serviceId: number;
  cid: string;
}

export interface IProposal {
  getOne(id: string): Promise<any>;
  getByServiceId(id: string): Promise<any>;
  getByUser(id: string): Promise<any>;
  getSignature(args: CreateProposalArgs): Promise<any>;
  upload(proposalDetails: ProposalDetails): Promise<string>;
  create(
      proposalDetails: ProposalDetails,
      userId: string,
      serviceId: string,
      rateAmount: string,
      expirationDate: string,
      referrerId?: string,
  ): Promise<ClientTransactionResponse>;
  update(
      proposalDetails: ProposalDetails,
      userId: string,
      serviceId: string,
      rateAmount: string,
      expirationDate: string,
      referrerId?: string,
  ): Promise<ClientTransactionResponse>;
}
