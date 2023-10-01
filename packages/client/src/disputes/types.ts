import { TransactionHash } from "../types";

export interface IDispute {
    getArbitrationPrice(): Promise<any>;
    setPrice(value: number | string): Promise<TransactionHash>;
}