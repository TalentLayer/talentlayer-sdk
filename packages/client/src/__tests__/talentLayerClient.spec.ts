import { ERC20 } from '../blockchain-bindings/erc20';
import { Disputes } from '../disputes';
import { Escrow } from '../escrow';
import { TalentLayerClient } from '../index';
import { Platform } from '../platform';
import { Profile } from '../profile';
import { Proposal } from '../proposals';
import { Review } from '../reviews';
import { Service } from '../services';
import { CustomConfig, NetworkEnum } from '../types';
import { testPlatformId } from '../__mocks__/fixtures';
import TalentLayerID from '../contracts/ABI/TalentLayerID.json';
import TalerLayerService from '../contracts/ABI/TalentLayerService.json';
import TalentLayerReview from '../contracts/ABI/TalentLayerReview.json';
import TalentLayerEscrow from '../contracts/ABI/TalentLayerEscrow.json';
import TalentLayerPlatformID from '../contracts/ABI/TalentLayerPlatformID.json';
import TalentLayerArbitrator from '../contracts/ABI/TalentLayerArbitrator.json';
import { getChainConfig } from '../config';

jest.mock('axios');
jest.mock('ipfs-http-client', () => ({
  create: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ path: '0xracoon' }), // Mocking the add method of IPFS client
    pin: { add: jest.fn().mockResolvedValue({ path: '0xRacoon' }) },
  })),
}));

describe('TalentLayerClient', () => {
  let client: any;

  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {});
    const chainId = 137;
    const ipfsConfig = {
      clientSecret: 'abcde',
      baseUrl: 'www.example.com',
    };
    const viemConfig = {};
    const platformID = testPlatformId;
    const signatureApiUrl = 'www.example.com';
    client = new TalentLayerClient({
      chainId: chainId,
      ipfsConfig: ipfsConfig,
      platformId: testPlatformId,
      signatureApiUrl: signatureApiUrl,
      debug: false,
    });
  });

  describe('constructor', () => {
    it('should be initialised successfully', async () => {
      expect(client).toBeDefined();
    });
  });

  describe('getters', () => {
    it('should return all domain specific getters', async () => {
      expect(client.platform).toBeInstanceOf(Platform);
      expect(client.erc20).toBeInstanceOf(ERC20);
      expect(client.proposal).toBeInstanceOf(Proposal);
      expect(client.disputes).toBeInstanceOf(Disputes);
      expect(client.service).toBeInstanceOf(Service);
      expect(client.profile).toBeInstanceOf(Profile);
      expect(client.escrow).toBeInstanceOf(Escrow);
      expect(client.review).toBeInstanceOf(Review);
    });
  });

  describe('getChainConfig', () => {
    it('should return the chain config based on the network id passed', () => {
      // Arrange
      const networkId = NetworkEnum.AMOY;

      // Act
      const config = client.getChainConfig(networkId);

      // Assert
      expect(config).toEqual(getChainConfig(networkId));
    });
  });
});

describe('TalentLayerClient:dev', () => {
  let client: any;

  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {});
    const chainId = 137;
    const ipfsConfig = {
      clientSecret: 'abcde',
      baseUrl: 'www.example.com',
    };
    const viemConfig = {};
    const platformID = testPlatformId;
    const signatureApiUrl = 'www.example.com';
    const localNetworkId = NetworkEnum.LOCAL;
    const customConfig: CustomConfig = {
      chainConfig: {
        id: localNetworkId,
        name: 'local',
        network: 'local',
        nativeCurrency: {
          name: 'racoon',
          symbol: 'RCN',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['http:localhost:1337'],
          },
          public: {
            http: ['http:localhost:1337'],
          },
        },
      },
      contractConfig: {
        networkId: localNetworkId,
        subgraphUrl: 'www.example.com',
        escrowConfig: {
          adminFee: '0',
          adminWallet: '0xC01FcDfDE3B2ABA1eab76731493C617FfAED2F10',
          timeoutPayment: 3600 * 24 * 7,
        },
        tokens: {
          '0x0000000000000000000000000000000000000000': {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'RLC',
            name: 'iExec RLC',
            decimals: 18,
          },
          '0xe62C28709E4F19Bae592a716b891A9B76bf897E4': {
            address: '0xe62C28709E4F19Bae592a716b891A9B76bf897E4',
            symbol: 'SERC20',
            name: 'SimpleERC20',
            decimals: 18,
          },
        },
        contracts: {
          talentLayerId: {
            address: '0xC51537E03f56650C63A9Feca4cCb5a039c77c822',
            abi: TalentLayerID.abi,
          },
          talentLayerService: {
            address: '0x45E8F869Fd316741A9316f39bF09AD03Df88496f',
            abi: TalerLayerService.abi,
          },
          talentLayerReview: {
            address: '0x6A5BF452108DA389B7B38284E871f538671Ad375',
            abi: TalentLayerReview.abi,
          },
          talentLayerEscrow: {
            address: '0x7A534501a6e63448EBC691f27B27B76d4F9b7E17',
            abi: TalentLayerEscrow.abi,
          },
          talentLayerPlatformId: {
            address: '0x05D8A2E01EB06c284ECBae607A2d0c2BE946Bf49',
            abi: TalentLayerPlatformID.abi,
          },
          talentLayerArbitrator: {
            address: '0x24cEd045b50cF811862B1c33dC6B1fbC8358F521',
            abi: TalentLayerArbitrator.abi,
          },
        },
      },
    };

    client = new TalentLayerClient({
      chainId: chainId,
      ipfsConfig: ipfsConfig,
      platformId: testPlatformId,
      signatureApiUrl: signatureApiUrl,
      customConfig: customConfig,
    });
  });

  describe('constructor', () => {
    it('should be initialised successfully', async () => {
      expect(client).toBeDefined();
    });
  });

  describe('getters', () => {
    it('should return all domain specific getters', async () => {
      expect(client.platform).toBeInstanceOf(Platform);
      expect(client.erc20).toBeInstanceOf(ERC20);
      expect(client.proposal).toBeInstanceOf(Proposal);
      expect(client.disputes).toBeInstanceOf(Disputes);
      expect(client.service).toBeInstanceOf(Service);
      expect(client.profile).toBeInstanceOf(Profile);
      expect(client.escrow).toBeInstanceOf(Escrow);
      expect(client.review).toBeInstanceOf(Review);
    });
  });

  describe('getChainConfig', () => {
    it('should return the chain config irrespective of the network id passed', () => {
      // Arrange
      const networkId = NetworkEnum.AMOY;

      // Act
      const config = client.getChainConfig(networkId);

      // Assert
      expect(config).toEqual(client.customConfig.contractConfig);
    });
  });
});
