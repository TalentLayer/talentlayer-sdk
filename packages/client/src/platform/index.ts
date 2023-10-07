import { Hash, parseEther, zeroAddress } from "viem";
import { getChainConfig } from "../config";
import { FEE_RATE_DIVIDER } from "../constants";
import GraphQLClient from "../graphql";
import IPFSClient from "../ipfs";
import { ClientTransactionResponse, TransactionHash } from "../types";
import { ViemClient } from "../viem";
import { getPlatformById, getPlatformsByOwner } from "./graphql/queries";
import { PlatformDetails } from "./types";

export class Platform {
  subgraph: GraphQLClient;
  wallet: ViemClient;
  platformID: number;
  ipfs: IPFSClient;

  static readonly UPDATE_ERROR = "unable to update platform details";

  constructor(
    graphQlClient: GraphQLClient,
    walletClient: ViemClient,
    platformId: number,
    ipfsClient: IPFSClient,
  ) {
    this.subgraph = graphQlClient;
    this.wallet = walletClient;
    this.platformID = platformId;
    this.ipfs = ipfsClient;
  }

  public async getOne(id: string): Promise<any> {
    const response = await this.subgraph.get(getPlatformById(id));

    if (response?.data?.platform) {
      return response?.data?.platform;
    }

    return null;
  }

  public async upload(data: PlatformDetails): Promise<string> {
    return this.ipfs.post(JSON.stringify(data));
  }

  public async getByOwner(address: `0x${string}`): Promise<any> {
    const response = await this.subgraph.get(getPlatformsByOwner(address));

    if (response?.data?.platforms) {
      return response?.data?.platforms;
    }

    return [];
  }

  public async update(
    data: PlatformDetails,
  ): Promise<ClientTransactionResponse> {
    console.log("SDK: update platform details");
    const cid = await this.upload(data);
    console.log("SDK: platform details uploaded to ipfs", cid);
    const tx = await this.wallet.writeContract(
      "talentLayerPlatformId",
      "updateProfileData",
      [this.platformID, cid],
    );

    if (!cid || !tx) {
      throw new Error(Platform.UPDATE_ERROR);
    }

    return { cid, tx };
  }

  public async setFeeTimeout(timeout: number): Promise<TransactionHash> {
    const tx = await this.wallet.writeContract(
      "talentLayerPlatformId",
      "updateArbitrationFeeTimeout",
      [this.platformID, timeout],
    );

    return tx;
  }

  public async updateArbitrator(
    address: `0x${string}`,
  ): Promise<TransactionHash> {
    const chainConfig = getChainConfig(this.wallet.chainId);
    const contract = chainConfig.contracts["talentLayerArbitrator"];
    const allowedArbitrators = [zeroAddress, contract.address.toLowerCase()];

    console.log("SDK: allowedArbitrators", allowedArbitrators);

    if (!allowedArbitrators.includes(address)) {
      throw new Error(`Invalid Arbitrator: ${address}`);
    }

    const tx = await this.wallet.writeContract(
      "talentLayerPlatformId",
      "updateArbitrator",
      [this.platformID, address, ""],
    );

    return tx;
  }

  // Fee functions
  public async updateOriginServiceFeeRate(
    value: number,
  ): Promise<TransactionHash> {
    const transformedFeeRate = Math.round(
      (Number(value) * FEE_RATE_DIVIDER) / 100,
    );

    console.log("SDK: transformedFeeRate", transformedFeeRate, this.platformID);
    const tx = await this.wallet.writeContract(
      "talentLayerPlatformId",
      "updateOriginServiceFeeRate",
      [this.platformID, transformedFeeRate],
    );

    return tx;
  }

  public async updateOriginValidatedProposalFeeRate(
    value: number,
  ): Promise<TransactionHash> {
    const transformedFeeRate = Math.round(
      (Number(value) * FEE_RATE_DIVIDER) / 100,
    );

    console.log("SDK: transformedFeeRate", transformedFeeRate, this.platformID);
    const tx = await this.wallet.writeContract(
      "talentLayerPlatformId",
      "updateOriginValidatedProposalFeeRate",
      [this.platformID, transformedFeeRate],
    );

    return tx;
  }

  public async updateServicePostingFee(
    value: number,
  ): Promise<TransactionHash> {
    const transformedFeeRate = parseEther(value.toString());

    console.log("SDK: transformedFeeRate", transformedFeeRate, this.platformID);
    const tx = await this.wallet.writeContract(
      "talentLayerPlatformId",
      "updateServicePostingFee",
      [this.platformID, transformedFeeRate],
    );

    return tx;
  }

  public async updateProposalPostingFee(
    value: number,
  ): Promise<TransactionHash> {
    const transformedFeeRate = parseEther(value.toString());
    console.log("SDK: updateProposalPostingFee", transformedFeeRate);

    const tx = await this.wallet.writeContract(
      "talentLayerPlatformId",
      "updateProposalPostingFee",
      [this.platformID, transformedFeeRate],
    );

    return tx;
  }
}

// TODO:
// add simlate contract in the main writeContract functions
