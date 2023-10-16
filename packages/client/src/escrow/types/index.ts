import { ClientTransactionResponse } from "../../types";

export interface IEscrow {
    approve(
        serviceId: string,
        proposalId: string,
        metaEvidenceCid: string,
    ): Promise<ClientTransactionResponse>;
    release(serviceId: string, amount: bigint, userId: number): Promise<any>;
    reimburse(serviceId: string, amount: bigint, userId: number): Promise<any>;
}
