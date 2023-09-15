export type IToken = {
    name: string;
    address: `0x${string}`;
    symbol: string;
    decimals: number;
    minimumTransactionAmount?: BigInt;
};

export enum NetworkEnum {
    LOCAL = 1337,
    MUMBAI = 80001,
}

export type Config = {
    networkId: NetworkEnum;
    subgraphUrl: string;
    escrowConfig: { [key: string]: any };
    contracts: { [key: string]: `0x${string}` };
    tokens: { [key: string]: IToken };
};

export type GraphQLConfig = {
    chainId: NetworkEnum,
    subgraphUrl: string
}

export type GraphQLQuery = string;