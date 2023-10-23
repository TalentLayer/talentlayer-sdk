export interface IFees {
  getMintFees(): Promise<any>;

  getProtocolAndPlatformsFees(
    originServicePlatformId: string,
    originValidatedProposalPlatformId: string,
  ): Promise<any>;
}
