import { parseEther } from "viem";
import { TransactionHash } from "../types";
import { ViemClient } from "../viem";


export class Disputes {

    wallet: ViemClient;
    platformID: number;
    constructor(walletClient: ViemClient, platformId: number) {
        this.wallet = walletClient;
        this.platformID = platformId;
    }

    public async getArbitrationPrice(): Promise<any> {
        const response = await this.wallet.readContract(
            'talentLayerArbitrator',
            'arbitrationPrice',
            [this.platformID]
        );

        console.log("SDK: getArbitrationPrice", response);

        return response;
    }

    public async setPrice(value: number | string): Promise<TransactionHash> {
        const transformedPrice = parseEther(value.toString());
        const tx = await this.wallet.writeContract(
            'talentLayerArbitrator',
            'setArbitrationPrice',
            [
                this.platformID,
                transformedPrice
            ]
        )

        return tx;
    }

}