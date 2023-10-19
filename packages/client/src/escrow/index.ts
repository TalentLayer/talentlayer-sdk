import { ERC20, IERC20 } from '../blockchain-bindings/erc20';
import GraphQLClient from '../graphql';
import IPFSClient from '../ipfs';
import { Proposal } from '../proposals';
import { Service } from '../services';
import { ClientTransactionResponse, NetworkEnum, RateToken } from '../types';
import { calculateApprovalAmount } from '../utils/fees';
import { ViemClient } from '../viem';
import { getProtocolAndPlatformsFees } from './graphql/queries';

export class Escrow {
  graphQlClient: GraphQLClient;
  ipfsClient: IPFSClient;
  viemClient: ViemClient;
  platformID: number;
  chainId: NetworkEnum;
  erc20: IERC20;

  constructor(
    graphQlClient: GraphQLClient,
    ipfsClient: IPFSClient,
    viemClient: ViemClient,
    platformId: number,
    chainId: NetworkEnum,
  ) {
    console.log('SDK: escrow initialising: ');
    this.graphQlClient = graphQlClient;
    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.chainId = chainId;
    this.erc20 = new ERC20(this.ipfsClient, this.viemClient, this.platformID, this.chainId);
  }

  public async approve(
    serviceId: string,
    proposalId: string,
    metaEvidenceCid: string,
  ): Promise<ClientTransactionResponse> {
    const proposalInstance = new Proposal(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID,
    );
    const proposal = await proposalInstance.getOne(proposalId);
    const erc20 = new ERC20(this.ipfsClient, this.viemClient, this.platformID, this.chainId);

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (!proposal.cid) {
      throw new Error('Proposal cid not found');
    }

    const sellerId: string = proposal.seller.id;

    let tx,
      cid = proposal.cid;

    const protocolAndPlatformsFeesResponse = await this.graphQlClient.get(
      getProtocolAndPlatformsFees(proposal.service.platform.id, proposal.platform.id),
    );

    console.log('SDK: fees', protocolAndPlatformsFeesResponse);

    if (!protocolAndPlatformsFeesResponse.data) {
      throw Error('Unable to fetch fees');
    }

    const approvalAmount = calculateApprovalAmount(
      proposal.rateAmount,
      protocolAndPlatformsFeesResponse.data.servicePlatform.originServiceFeeRate,
      protocolAndPlatformsFeesResponse.data.proposalPlatform.originValidatedProposalFeeRate,
      protocolAndPlatformsFeesResponse.data.protocols[0].protocolEscrowFeeRate,
    );

    console.log('SDK: escrow seeking approval for amount: ', approvalAmount);

    if (proposal.rateToken.address === RateToken.NATIVE) {
      tx = await this.viemClient.writeContract(
        'talentLayerEscrow',
        'createTransaction',
        [parseInt(serviceId, 10), parseInt(sellerId, 10), metaEvidenceCid, cid],
        approvalAmount,
      );
    } else {
      console.log('SDK: fetching allowance');
      // @ts-ignore
      const allowance: bigint = await erc20.checkAllowance(proposal.rateToken.address);

      console.log('SDK: fetched allowance', allowance, allowance < BigInt(proposal.rateAmount));

      if (allowance < approvalAmount) {
        console.log('SDK: approvalAmount less than allowance. Now requesting allowance');

        let approvalTransaction;
        try {
          approvalTransaction = await this.erc20.approve(
            proposal.rateToken.address,
            approvalAmount,
          );

          // @ts-ignore
          const approvalTransactionReceipt =
            await this.viemClient.publicClient.waitForTransactionReceipt({
              hash: approvalTransaction,
            });

          console.log('SDK: approvalTransactionReceipt', approvalTransactionReceipt);

          if (approvalTransactionReceipt.status !== 'success') {
            throw new Error('Unable to get approval');
          }
        } catch (e) {
          console.error('SDK error: ', e);
          throw new Error('Approval transaction failed with error');
        }
      }

      tx = await this.viemClient.writeContract('talentLayerEscrow', 'createTransaction', [
        parseInt(serviceId, 10),
        parseInt(sellerId, 10),
        metaEvidenceCid,
        cid,
      ]);
    }

    if (tx) {
      return { tx, cid: proposal.cid };
    }

    throw new Error('Error creating Transaction');
  }

  public async release(serviceId: string, amount: bigint, userId: number): Promise<any> {
    const serviceInstance = new Service(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID,
    );
    const service = await serviceInstance.getOne(serviceId);
    const transactionId = service?.transaction?.id;

    if (!transactionId) {
      throw new Error('service transaction not found');
    }

    if (!transactionId) {
      throw new Error('Transaction Id not found for service');
    }

    const tx = await this.viemClient.writeContract('talentLayerEscrow', 'release', [
      userId,
      parseInt(transactionId),
      amount.toString(),
    ]);

    return tx;
  }

  public async reimburse(serviceId: string, amount: bigint, userId: number): Promise<any> {
    const serviceInstance = new Service(
      this.graphQlClient,
      this.ipfsClient,
      this.viemClient,
      this.platformID,
    );
    const service = await serviceInstance.getOne(serviceId);
    const transactionId = service?.transaction?.id;

    if (!transactionId) {
      throw new Error('service transaction not found');
    }

    if (!transactionId) {
      throw new Error('Transaction Id not found for service');
    }

    const tx = await this.viemClient.writeContract('talentLayerEscrow', 'reimburse', [
      userId,
      parseInt(transactionId),
      amount.toString(),
    ]);

    return tx;
  }
}
