import { defineChain } from "viem";
import { polygonMumbai } from 'viem/chains';
import { NetworkEnum } from "../types";

// @ts-ignore
const iexec = defineChain({
    id: 134,
    name: 'iExec Sidechain',
    network: 'iexec',
    nativeCurrency: {
        decimals: 18,
        name: 'xRLC',
        symbol: 'xRLC',
    },
    rpcUrls: {
        default: {
            http: ['https://bellecour.iex.ec'],
        },
        public: {
            http: ['https://bellecour.iex.ec'],
        },
    },
    blockExplorers: {
        default: { name: 'BlockScout', url: 'https://blockscout-bellecour.iex.ec/' },
    },
    testnet: false,
});


export const chains = {
    [NetworkEnum.MUMBAI]: polygonMumbai,
    [NetworkEnum.IEXEC]: iexec
}