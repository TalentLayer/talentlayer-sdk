
import { Proposal } from '..';
import { MockGraphQLClient, MockIPFSClient, MockViemClient } from '../../__mocks__/clientMocks';
import { testAddress, testAmount, testChainId, testCid, testExpirationDate, testIpfsHash, testOwnerAddress, testPlatformDetails, testPlatformId, testPlatformResponse, testPlatformsByOwnerResponse, testProposalDetails, testProposalId, testProposalResponse, testProposalsByServiceId, testProposalsByUser, testProtocolAndPlatformResponse, testServiceId, testSignature, testUserId } from '../../__mocks__/fixtures';
// Additional imports...

describe('Platform', () => {
    let proposal: Proposal;
    let mockGraphQLClient: any;
    let mockIPFSClient: any;
    let mockViemClient: any;

    beforeEach(() => {
        mockGraphQLClient = new MockGraphQLClient();
        // mockGraphQLClient = new GraphQLClient(getGraphQLConfig(137))
        mockIPFSClient = new MockIPFSClient();
        mockViemClient = new MockViemClient();
        proposal = new Proposal(mockGraphQLClient, mockIPFSClient, mockViemClient, testPlatformId, 'example.com');
    });

    describe('getOne', () => {
        it('should return proposal details based on id', async () => {
            // Arrange
            const proposalId = testProposalId;

            // Act
            const response = await proposal.getOne(proposalId);

            //Assert
            expect(response).toEqual(testProposalResponse.data.proposal);
        })
    })

    describe('getByServiceId', () => {
        it('should return proposal details based on service id', async () => {
            // Arrange
            const serviceId = testServiceId;

            // Act
            const response = await proposal.getByServiceId(serviceId);

            //Assert
            expect(response).toEqual(testProposalsByServiceId.data.proposals);
        })
    })

    describe('getByUser', () => {
        it('should return all proposal for a user', async () => {
            // Arrange
            const userId = testUserId;

            // Act
            const resposne = await proposal.getByUser(userId);

            expect(resposne).toEqual(testProposalsByUser.data.proposals)
        })
    })

    describe('update', () => {
        it('should update proposal Details', async () => {
            // Arrange
            const proposalDetails = testProposalDetails;
            const userId = testUserId;
            const serviceId = testServiceId;
            const rateToken = testAddress;
            const rateAmount = testAmount;
            const expirationDate = testExpirationDate;

            // Act
            const resposne = await proposal.update(proposalDetails, userId, serviceId, rateToken, rateAmount.toString(), expirationDate)

            // Assert
            expect(mockIPFSClient.post).toHaveBeenCalledWith(JSON.stringify(proposalDetails));
            expect(mockViemClient.writeContract).toHaveBeenLastCalledWith(
                'talentLayerService',
                'updateProposal',
                [userId, serviceId, rateToken, rateAmount.toString(), testIpfsHash, expirationDate]
            )
        })
    })

    describe('create', () => {
        it('should create a proposal for a service', async () => {
            // Arrange
            const proposalDetails = testProposalDetails;
            const userId = testUserId;
            const serviceId = testServiceId;
            const rateToken = testAddress;
            const rateAmount = testAmount;
            const expirationDate = testExpirationDate;
            const signatureResponse = testSignature;
            jest.spyOn(proposal, 'getSignature').mockResolvedValueOnce(signatureResponse);

            // Act
            const resposne = await proposal.create(proposalDetails, userId, serviceId, rateToken, rateAmount.toString(), expirationDate)

            // Assert
            expect(mockViemClient.writeContract).toHaveBeenCalledWith(
                'talentLayerService',
                'createProposal',
                [userId, serviceId, rateToken, rateAmount.toString(), testPlatformId, testIpfsHash, expirationDate, signatureResponse],
                BigInt(testPlatformResponse.data.platform.proposalPostingFee),
            )

        })
    })
});
