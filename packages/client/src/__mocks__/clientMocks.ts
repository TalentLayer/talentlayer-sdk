import { getPaymentsByService, getProtocolAndPlatformsFees } from "../escrow/graphql/queries";
import { getPlatformById, getPlatformsByOwner, getProtocolById } from "../platform/graphql/queries";
import { getMintFees, getPaymentsForUser, getProfileByAddress, getProfileById, getProfiles, getUserTotalGains } from "../profile/graphql";
import { getAllProposalsByServiceId, getAllProposalsByUser, getProposalById } from "../proposals/graphql";
import { getReviewsByService } from "../reviews/graphql";
import { getOne, getServices, searchServices } from "../services/graphql/queries";
import { mockGraphQlMintFeesResponse, mockGraphQlProtocolByIdResponse, mockGraphQlUsersResponse, testAddress, testChainId, testGetProfilesResponse, testIpfsHash, testOwnerAddress, testPaymentsByServiceResponse, testPlatformId, testPlatformResponse, testPlatformResponseWithArbitrator, testPlatformsByOwnerResponse, testProposalId, testProposalIdWithDifferentRateToken, testProposalResponse, testProposalResponseWithDifferentRateToken, testProposalsByServiceId, testProposalsByUser, testProtocolAndPlatformResponse, testReviewsByService, testSearchServiceProps, testSearchServicesResponse, testServiceId, testServiceResponse, testUserId, testUserPaymentsResponse, testUserResponse, testUserTotalGainsResponse } from "./fixtures";

export class MockGraphQLClient {
    get = jest.fn(async (query: string) => {
        if (query === getProfileByAddress(testAddress)) {
            return mockGraphQlUsersResponse;
        }

        if (query === getMintFees()) {
            return mockGraphQlMintFeesResponse
        }

        if (query === getProtocolById(1)) {
            return mockGraphQlProtocolByIdResponse;
        }

        if (query === getProfileById(testUserId)) {
            return testUserResponse;
        }

        if (query === getProfiles(1, 0, 'racoon')) {
            return testGetProfilesResponse;
        }

        if (query === getPaymentsForUser(testUserId)) {
            return testUserPaymentsResponse;
        }

        if (query === getUserTotalGains(testUserId)) {
            return testUserTotalGainsResponse;
        }

        if (query === getPlatformById(testPlatformId.toString())) {
            return testPlatformResponse;
        }

        if (query === getPlatformById("2")) {
            return testPlatformResponseWithArbitrator;
        }

        if (query === getProposalById(testProposalId)) {
            return testProposalResponse;
        }

        if (query === getProposalById(testProposalIdWithDifferentRateToken)) {
            return testProposalResponseWithDifferentRateToken;
        }

        if (query === getProtocolAndPlatformsFees(testProposalResponse.data.proposal.service.platform.id, testProposalResponse.data.proposal.platform.id)) {
            return testProtocolAndPlatformResponse;
        }

        if (query === getOne(testServiceId)) {
            return testServiceResponse;
        }

        if (query === getPaymentsByService(testServiceId)) {
            return testPaymentsByServiceResponse;
        }

        if (query === getPlatformsByOwner(testOwnerAddress)) {
            return testPlatformsByOwnerResponse;
        }

        if (query === getAllProposalsByServiceId(testServiceId)) {
            return testProposalsByServiceId;
        }

        if (query === getAllProposalsByUser(testUserId)) {
            return testProposalsByUser;
        }

        if (query === searchServices(testSearchServiceProps) || query === getServices(testSearchServiceProps)) {
            return testSearchServicesResponse;
        }

        if (query === getReviewsByService(testServiceId)) {
            return testReviewsByService;
        }

        return { data: { "racoon": "bar" } };
    })

}

export class MockViemClient {
    writeContract = jest.fn(async () => testAddress)
    chainId = 137;
    readContract = jest.fn(async () => "randomData")
    publicClient = {
        readContract: jest.fn(async () => "randomData"),
        waitForTransactionReceipt: jest.fn(async () => ({ status: 'success' }))
    }

}

export class MockIPFSClient {
    post = jest.fn().mockResolvedValue(testIpfsHash);
}