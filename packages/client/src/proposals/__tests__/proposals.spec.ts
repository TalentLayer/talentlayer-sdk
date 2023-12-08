
import { Proposal } from '..';
import { MockGraphQLClient, MockIPFSClient, MockViemClient } from '../../__mocks__/clientMocks';
import {
    testAmount,
    testExpirationDate,
    testIpfsHash,
    testPlatformId,
    testPlatformResponse,
    testProposalDetails,
    testProposalId,
    testProposalResponse,
    testProposalsByServiceId,
    testProposalsByUser,
    testReferrerUserId,
    testServiceId,
    testSignature,
    testUserId
} from '../../__mocks__/fixtures';
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
            const rateAmount = testAmount;
            const expirationDate = testExpirationDate;
            const referrerId = testReferrerUserId;

            // Act
            const response = await proposal.update(proposalDetails, userId, serviceId, rateAmount.toString(), expirationDate, referrerId)

            // Assert
            expect(mockIPFSClient.post).toHaveBeenCalledWith(JSON.stringify(proposalDetails));
            expect(mockViemClient.writeContract).toHaveBeenLastCalledWith(
                'talentLayerService',
                'updateProposal',
                [userId, serviceId, rateAmount.toString(), testIpfsHash, expirationDate, referrerId]
            )
        })
    })

    describe('create', () => {
        it('should create a proposal for a service', async () => {
            // Arrange
            const proposalDetails = testProposalDetails;
            const userId = testUserId;
            const serviceId = testServiceId;
            const rateAmount = testAmount;
            const expirationDate = testExpirationDate;
            const signatureResponse = testSignature;
            const referrerId = testReferrerUserId;

            jest.spyOn(proposal, 'getSignature').mockResolvedValueOnce(signatureResponse);

            // Act
            const response = await proposal.create(proposalDetails, userId, serviceId, rateAmount.toString(), expirationDate, referrerId)

            // Assert
            expect(mockViemClient.writeContract).toHaveBeenCalledWith(
                'talentLayerService',
                'createProposal',
                [userId, serviceId, rateAmount.toString(), testPlatformId, testIpfsHash, expirationDate, signatureResponse, referrerId],
                BigInt(testPlatformResponse.data.platform.proposalPostingFee),
            )

        })
    })
});
