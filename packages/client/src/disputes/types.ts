import { TransactionHash } from "../types";

export interface IDispute {
  getArbitrationCost(): Promise<any>;
  setPrice(value: number | string): Promise<TransactionHash>;
}
