
import { ERC20 } from '../blockchain-bindings/erc20';
import { Disputes } from '../disputes';
import { Escrow } from '../escrow';
import { TalentLayerClient } from '../index';
import { Platform } from '../platform';
import { Profile } from '../profile';
import { Proposal } from '../proposals';
import { Review } from '../reviews';
import { Service } from '../services';
import { testPlatformId } from '../__mocks__/fixtures';


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
        const viemConfig = {};
        const platformID = testPlatformId;
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