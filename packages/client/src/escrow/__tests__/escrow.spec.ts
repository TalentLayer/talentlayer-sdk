
import { Escrow } from '..';
import { MockGraphQLClient, MockIPFSClient, MockViemClient } from '../../__mocks__/clientMocks';
import { testAddress, testAmount, testChainId, testCid, testIpfsHash, testMetaEvidenceCid, testPlatformId, testProposalId, testProposalIdWithDifferentRateToken, testProposalResponse, testProtocolAndPlatformResponse, testServiceId, testServiceResponse, testUserId } from '../../__mocks__/fixtures';
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
            const serviceId = testServiceId;
            const proposalId = testProposalId;
            const metaEvidenceCid = testMetaEvidenceCid;

            // Act
            const result = await escrow.approve(serviceId, proposalId, metaEvidenceCid);

            expect(result.tx).toEqual(testAddress)
            expect(result.cid).toEqual(testCid)
        });

        it('should successfully approve with a non-native approved rateToken', async () => {
            // Arrange
            const serviceId = testServiceId;
            const proposalId = testProposalIdWithDifferentRateToken;
            const metaEvidenceCid = testMetaEvidenceCid;
            escrow.erc20 = {
                ...escrow.erc20, // Spread the existing properties

                checkAllowance: jest.fn(async () => BigInt('10100000000000000001'))
            };

            // Act
            const result = await escrow.approve(serviceId, proposalId, metaEvidenceCid);

            // Assert
            expect(result.tx).toEqual(testAddress)
            expect(result.cid).toEqual(testCid)
        })

        it('should successfully approve with a non-native unapproved rateToken', async () => {
            // Arrange
            const serviceId = testServiceId;
            const proposalId = testProposalIdWithDifferentRateToken;
            const metaEvidenceCid = testMetaEvidenceCid;
            escrow.erc20 = {
                ...escrow.erc20, // Spread the existing properties

                checkAllowance: jest.fn(async () => BigInt('10000000000000000000')),
                approve: jest.fn(async () => testAddress)
            };

            // Act
            const result = await escrow.approve(serviceId, proposalId, metaEvidenceCid);

            // Assert
            expect(mockViemClient.writeContract).toHaveBeenCalledWith(
                'talentLayerEscrow',
                'createTransaction',
                [parseInt(serviceId, 10), parseInt(testProposalResponse.data.proposal.seller.id, 10), metaEvidenceCid, testIpfsHash]
            )
            expect(result.tx).toEqual(testAddress)
            expect(result.cid).toEqual(testCid)
        })

        it('should handle errors when proposal not found', async () => {
            // Arrange
            const serviceId = testServiceId;
            const proposalId = 'not-found';
            const metaEvidenceCid = testMetaEvidenceCid;

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
    });


    describe('getByService', () => {
        it('should fetch and return service data', async () => {
            // Arrange
            const serviceId = testServiceId;

            // Act
            const serviceData = await escrow.getByService(serviceId);

            // Assert
            expect(serviceData).toBeDefined();
        });
    });

    describe('release', () => {
        it('should release payment', async () => {
            // Arrange
            const serviceId = testServiceId;
            const amount = testAmount;
            const userId = testUserId;

            // Act
            const resposne = await escrow.release(serviceId, amount, userId);

            // Assert
            expect(mockViemClient.writeContract).toHaveBeenCalledWith(
                'talentLayerEscrow',
                'release',
                [userId, parseInt(testServiceResponse.data.service.transaction.id), amount.toString()]
            )

        })
    })

});