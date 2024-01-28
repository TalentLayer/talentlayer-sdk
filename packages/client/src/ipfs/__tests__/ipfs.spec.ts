import IPFSClient from "..";
import { IPFSClientConfig } from "../../types";

jest.mock('axios')
jest.mock('ipfs-http-client', () => ({
    create: jest.fn().mockImplementation(() => ({
        add: jest.fn().mockResolvedValue({ path: '0xracoon' }), // Mocking the add method of IPFS client
        pin: { add: jest.fn().mockResolvedValue({ path: '0xRacoon' }) }
    })),
}));

describe('IPFSClient', () => {
    let ipfsClientConfig: IPFSClientConfig;
    let ipfsClient: IPFSClient;

    beforeEach(() => {
        ipfsClientConfig = { clientId: 'clientId', clientSecret: 'clientSecret', baseUrl: 'baseUrl' };
        ipfsClient = new IPFSClient(ipfsClientConfig);
    });

    describe('post', () => {
        test('should post data successfully', async () => {
            // Arrange
            const data = 'someData';

            // Act
            console.log(ipfsClient)
            const result = await ipfsClient.post(data);

            // Assert
            expect(result).toEqual('0xracoon');
        });

        test('should throw an error if the IPFS client is not initialized', async () => {
            // Arrange
            const data = 'someData';
            ipfsClient.ipfs = null;  // Simulating an uninitialized IPFS client

            // Act & Assert
            await expect(ipfsClient.post(data)).rejects.toThrow('IPFS client not intiialised properly');
        });
    });

    // Additional tests as needed...
});