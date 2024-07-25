import { defineChain } from 'viem';
import { polygon, polygonMumbai, avalancheFuji } from 'viem/chains';
import { NetworkEnum } from '../types';

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
    default: {
      name: 'BlockScout',
      url: 'https://blockscout-bellecour.iex.ec/',
    },
  },
  testnet: false,
});

export const polygonAmoy = defineChain({
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-amoy.polygon.technology'],
    },
    public: {
      http: ['https://rpc-amoy.polygon.technology'],
    },
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: 'https://amoy.polygonscan.com/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 3127388,
    },
  },
  testnet: true,
  network: "polygon"
})

export const chains = {
  [NetworkEnum.MUMBAI]: polygonMumbai,
  [NetworkEnum.AMOY]: polygonAmoy,
  [NetworkEnum.IEXEC]: iexec,
  [NetworkEnum.POLYGON]: polygon,
  [NetworkEnum.FUJI]: avalancheFuji,
};
