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
  getSignature(args: CreateProposalArgs): Promise<any>;

  getOne(proposalId: string): Promise<any>;

  getByServiceId(serviceId: string): Promise<any>;

  getByUser(userId: string): Promise<any>;

  create(
    proposalDetails: ProposalDetails,
    userId: string,
    serviceId: string,
    rateToken: string,
    rateAmount: string,
    expirationDate: string
  ): Promise<ClientTransactionResponse>;

  update(
    proposalDetails: ProposalDetails,
    userId: string,
    serviceId: string,
    rateToken: string,
    rateAmount: string,
    expirationDate: string
  ): Promise<ClientTransactionResponse>;

  upload(proposalDetails: ProposalDetails): Promise<string>;
}
