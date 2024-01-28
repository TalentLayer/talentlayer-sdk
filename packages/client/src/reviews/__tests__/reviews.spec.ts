
import { Review } from '..';
import { getGraphQLConfig } from '../../config';
import GraphQLClient from '../../graphql';
import { Logger } from '../../logger';
import { MockGraphQLClient, MockIPFSClient, MockViemClient } from '../../__mocks__/clientMocks';
import { testAddress, testAmount, testChainId, testCid, testIpfsHash, testMetaEvidenceCid, testPlatformId, testProposalId, testProposalIdWithDifferentRateToken, testProposalResponse, testProtocolAndPlatformResponse, testReviewDetails, testReviewsByService, testServiceId, testServiceResponse, testUserId } from '../../__mocks__/fixtures';
import { getReviewsByService } from '../graphql';
// DO NOT remove this comments - they are needed for local testing
// import { getGraphQLConfig } from "../../config";
// import GraphQLClient from "../../graphql";


describe('Review', () => {
    let review: any;
    let mockGraphQLClient: any;
    let mockIPFSClient: any;
    let mockViemClient: any;
    let logger: Logger;

    beforeEach(() => {
        mockGraphQLClient = new MockGraphQLClient();
        // DO NOT remove this comments - they are needed for local testing
        // mockGraphQLClient = new GraphQLClient(getGraphQLConfig(80001))
        mockIPFSClient = new MockIPFSClient();
        mockViemClient = new MockViemClient();
        logger = new Logger('TalentLayer SDK', true);
        review = new Review(mockGraphQLClient, mockIPFSClient, mockViemClient, testPlatformId, logger);
    });

    describe('uploadReviewDataToIpfs', () => {
        it('should upload review data object to ipfs', async () => {
            // Arrange
            const reviewDetails = testReviewDetails;

            // Act
            const response = await review.uploadReviewDataToIpfs(reviewDetails);

            // Assert
            expect(mockIPFSClient.post).toHaveBeenCalledWith(JSON.stringify(reviewDetails));
            expect(response).toEqual(testIpfsHash);

        })
    })

    describe('create', () => {
        it('should create a review for a service', async () => {
            // Arrange
            const reviewDetails = testReviewDetails;

            // Act
            const response = await review.create(reviewDetails, testServiceId, testUserId);

            // Assert
            expect(mockIPFSClient.post).toHaveBeenCalledWith(JSON.stringify(reviewDetails));
            expect(response.cid).toEqual(testIpfsHash);
            expect(response.tx).toEqual(testAddress);
        })
    })

    describe('getByService', () => {
        it('should return reviews for a service', async () => {
            // Arrange
            const serviceId = testServiceId;

            // Act
            const response = await review.getByService(serviceId);

            // Assert
            expect(mockGraphQLClient.get).toHaveBeenCalledWith(getReviewsByService(testServiceId));
            expect(response).toEqual(testReviewsByService.data)
        })
    })

});