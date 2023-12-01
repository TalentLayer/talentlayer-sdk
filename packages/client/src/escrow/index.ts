import { ERC20, IERC20 } from '../blockchain-bindings/erc20';
import GraphQLClient from '../graphql';
import IPFSClient from '../ipfs';
import { Proposal } from '../proposals';
import { Service } from '../services';
import { ChainConfig, ClientTransactionResponse, NetworkEnum, RateToken } from '../types';
import { calculateApprovalAmount } from '../utils/fees';
import { ViemClient } from '../viem';
import { getPaymentsByService, getProtocolAndPlatformsFees } from './graphql/queries';



/**
 * Release and reimburse payments using TalentLayer escrow
 *
 * @group TalentLayerClient Modules
 */
export class Escrow {

  /** @hidden */
  graphQlClient: GraphQLClient;
  /** @hidden */
  ipfsClient: IPFSClient;
  /** @hidden */
  viemClient: ViemClient;
  /** @hidden */
  platformID: number;
  /** @hidden */
  chainId: NetworkEnum;
  /** @hidden */
  erc20: IERC20;
  /** @hidden */
  chainConfig: ChainConfig;

  /** @hidden */
  constructor(
    graphQlClient: GraphQLClient,
    ipfsClient: IPFSClient,
    viemClient: ViemClient,
    platformId: number,
    chainId: NetworkEnum,
    chainConfig: ChainConfig

  ) {
    console.log('SDK: escrow initialising');
    this.graphQlClient = graphQlClient;
    this.platformID = platformId;
    this.ipfsClient = ipfsClient;
    this.viemClient = viemClient;
    this.chainId = chainId;
    this.chainConfig = chainConfig;
    this.erc20 = new ERC20(this.ipfsClient, this.viemClient, this.platformID, this.chainConfig);
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
    const erc20 = this.erc20;

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (!proposal.cid) {
      throw new Error('Proposal cid not found');
    }

    const sellerId: string = proposal.seller.id;

    let tx,
      cid = proposal.cid;

    const protocolAndPlatformsFees = await this.getProtocolAndPlatformsFees(
      proposal.service.platform.id, proposal.platform.id
    );

    console.log('SDK: fees', protocolAndPlatformsFees);

    if (!protocolAndPlatformsFees) {
      throw Error('Unable to fetch fees');
    }

    const approvalAmount = calculateApprovalAmount(
      proposal.rateAmount,
      protocolAndPlatformsFees.servicePlatform.originServiceFeeRate,
      protocolAndPlatformsFees.proposalPlatform.originValidatedProposalFeeRate,
      protocolAndPlatformsFees.protocols[0].protocolEscrowFeeRate,
    );

    console.log('SDK: escrow seeking approval for amount: ', approvalAmount.toString());

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

  public async getProtocolAndPlatformsFees(
    originServicePlatformId: string,
    originValidatedProposalPlatformId: string,
  ): Promise<any> {
    const query = getProtocolAndPlatformsFees(originServicePlatformId, originValidatedProposalPlatformId);

    const response = await this.graphQlClient.get(query);

    return response?.data || null;
  }

  public async getByService(serviceId: string, paymentType?: string): Promise<any> {
    const query = getPaymentsByService(serviceId, paymentType);

    const response = await this.graphQlClient.get(query);

    return response?.data?.payments || null
  }

}
