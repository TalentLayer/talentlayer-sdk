
import { ERC20 } from '../blockchain-bindings/erc20';
import { Disputes } from '../disputes';
import { Escrow } from '../escrow';
import { TalentLayerClient } from '../index';
import { Platform } from '../platform';
import { Profile } from '../profile';
import { Proposal } from '../proposals';
import { Review } from '../reviews';
import { Service } from '../services';
import { CustomChainConfig } from '../types';
import { testAddress, testPlatformId } from '../__mocks__/fixtures';


jest.mock('axios')
jest.mock('ipfs-http-client', () => ({
    create: jest.fn().mockImplementation(() => ({
        add: jest.fn().mockResolvedValue({ path: '0xracoon' }), // Mocking the add method of IPFS client
    })),
}));

describe('TalentLayerClient', () => {
    let client: any;

    beforeEach(() => {
        Object.defineProperty(globalThis, 'window', {
        });
        const chainId = 137;
        const ipfsConfig = {
            clientId: 'abcd',
            clientSecret: 'abcde',
            baseUrl: 'www.example.com'
        }

        const signatureApiUrl = 'www.example.com';
        client = new TalentLayerClient({
            chainId: chainId,
            ipfsConfig: ipfsConfig,
            platformId: testPlatformId,
            signatureApiUrl: signatureApiUrl
        })


    })

    describe('constructor', () => {
        it('should be initialised successfully', async () => {
            expect(client).toBeDefined()

        })
    })

    describe('getters', () => {
        it('should return all domain specific getters', async () => {
            expect(client.platform).toBeInstanceOf(Platform)
            expect(client.erc20).toBeInstanceOf(ERC20)
            expect(client.proposal).toBeInstanceOf(Proposal)
            expect(client.disputes).toBeInstanceOf(Disputes)
            expect(client.service).toBeInstanceOf(Service)
            expect(client.profile).toBeInstanceOf(Profile)
            expect(client.escrow).toBeInstanceOf(Escrow)
            expect(client.review).toBeInstanceOf(Review)
        })
    })
});

describe('TalentLayerClient:customchainConfig', () => {
    let client: any;

    beforeEach(() => {
        Object.defineProperty(globalThis, 'window', {
        });
        const chainDefintion = {
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
        };

        const customChainConfig: CustomChainConfig = {
            networkId: 135,
            chainDefinition: chainDefintion,
            subgraphUrl: 'www.example.com',
            contracts: {
                talentLayerId: {
                    address: testAddress,
                    abi: {}
                }
            },
            escrowConfig: {
                adminFee: '0',
                adminWallet: testAddress,
                timeoutPayment: 100,
            },
            tokens: {
                [testAddress]: {
                    address: testAddress,
                    symbol: 'RAC',
                    name: 'RACOON',
                    decimals: 18,
                }
            }
        }
        const ipfsConfig = {
            clientId: 'abcd',
            clientSecret: 'abcde',
            baseUrl: 'www.example.com'
        }

        const signatureApiUrl = 'www.example.com';
        client = new TalentLayerClient({
            ipfsConfig: ipfsConfig,
            platformId: testPlatformId,
            signatureApiUrl: signatureApiUrl,
            customChainConfig
        })


    })


    describe('constructor', () => {
        it('should be initialised successfully when chain config is passed', () => {
            expect(client).toBeDefined()

        })

        it('should throw error if the sdk is intialised without networkId and customChainConfig', () => {
            const ipfsConfig = {
                clientId: 'abcd',
                clientSecret: 'abcde',
                baseUrl: 'www.example.com'
            }

            const signatureApiUrl = 'www.example.com';
            expect(() => {
                new TalentLayerClient({
                    ipfsConfig: ipfsConfig,
                    platformId: testPlatformId,
                    signatureApiUrl: signatureApiUrl
                })
            }).toThrow('Atleast one of chainId or customChainConfig need to be provided')


        })
    })

    describe('getters', () => {
        it('should return all domain specific getters', async () => {
            expect(client.platform).toBeInstanceOf(Platform)
            expect(client.erc20).toBeInstanceOf(ERC20)
            expect(client.proposal).toBeInstanceOf(Proposal)
            expect(client.disputes).toBeInstanceOf(Disputes)
            expect(client.service).toBeInstanceOf(Service)
            expect(client.profile).toBeInstanceOf(Profile)
            expect(client.escrow).toBeInstanceOf(Escrow)
            expect(client.review).toBeInstanceOf(Review)
        })
    })
})