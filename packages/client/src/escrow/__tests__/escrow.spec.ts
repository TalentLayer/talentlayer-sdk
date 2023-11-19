
import { Escrow } from '..';
import { MockGraphQLClient, MockIPFSClient, MockViemClient } from '../../__mocks__/clientMocks';
import { testAddress, testAmount, testChainId, testCid, testPlatformId, testProposalId, testProposalResponse, testProtocolAndPlatformResponse, testServiceId, testUserId } from '../../__mocks__/fixtures';
// DO NOT remove this comments - they are needed for local testing
// import { getGraphQLConfig } from "../../config";
// import GraphQLClient from "../../graphql";


describe('Escrow', () => {
    let escrow: any;
    let mockGraphQLClient: any;
    let mockIPFSClient: any;
    let mockViemClient: any;

    beforeEach(() => {
        mockGraphQLClient = new MockGraphQLClient();
        // DO NOT remove this comments - they are needed for local testing
        // mockGraphQLClient = new GraphQLClient(getGraphQLConfig(137))
        mockIPFSClient = new MockIPFSClient();
        mockViemClient = new MockViemClient();
        escrow = new Escrow(mockGraphQLClient, mockIPFSClient, mockViemClient, testPlatformId, testChainId);
    });

    describe('approve', () => {
        it('should successfully approve', async () => {
            // Arrange
            const serviceId = 'testServiceId';
            const proposalId = testProposalId;
            const metaEvidenceCid = 'testMetaEvidenceCid';

            // Act
            const result = await escrow.approve(serviceId, proposalId, metaEvidenceCid);

            expect(result.tx).toEqual(testAddress)
            expect(result.cid).toEqual(testCid)

            // Additional assertions...
        });

        it('should handle errors when proposal not found', async () => {
            // Arrange
            const serviceId = 'testServiceId';
            const proposalId = 'not-found';
            const metaEvidenceCid = 'testMetaEvidenceCid';

            // Act and Assert
            await expect(escrow.approve(serviceId, proposalId, metaEvidenceCid)).rejects.toThrow('Proposal not found');
        });

        it('should handle error when platform data not found', async () => {
            // Arrange
            const serviceId = 'testServiceId';
            const proposalId = testProposalId;
            const metaEvidenceCid = 'testMetaEvidenceCid';
            jest.spyOn(escrow, 'getProtocolAndPlatformsFees').mockResolvedValue(null); // Simulate proposal not found

            // Act and Assert
            await expect(escrow.approve(serviceId, proposalId, metaEvidenceCid)).rejects.toThrow('Unable to fetch fees');

        })

        // Additional test cases...
    });

    describe('reimburse', () => {
        it('should successfully reimburse', async () => {
            // Arrange
            const serviceId = testServiceId;
            const userId = testUserId; // Example user ID
            const amount = testAmount; // Example amount

            // Mock necessary dependencies and method calls
            // ...

            // Act
            const result = await escrow.reimburse(serviceId, userId, amount);

            // Assert
            expect(result).toEqual(testAddress)
        });

    })

    describe('getProtocolAndPlatformsFees', () => {
        it('should fetch and return fees data', async () => {
            // Arrange
            const platformId1 = testProposalResponse.data.proposal.service.platform.id;
            const platformId2 = testProposalResponse.data.proposal.platform.id;

            // Mock GraphQLClient responses
            // ...

            // Act
            const feesData = await escrow.getProtocolAndPlatformsFees(platformId1, platformId2);

            // Assert
            expect(feesData).toEqual(testProtocolAndPlatformResponse.data)

        });

        // Additional test cases for error scenarios...
    });


    describe('getByService', () => {
        it('should fetch and return service data', async () => {
            // Arrange
            const serviceId = testServiceId;

            // Mock GraphQLClient responses
            // ...

            // Act
            const serviceData = await escrow.getByService(serviceId);

            // Assert
            expect(serviceData).toBeDefined();
        });

        // Additional test cases for error scenarios...
    });

});