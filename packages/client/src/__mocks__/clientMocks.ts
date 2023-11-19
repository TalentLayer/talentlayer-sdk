import { getPaymentsByService, getProtocolAndPlatformsFees } from "../escrow/graphql/queries";
import { getPlatformById, getProtocolById } from "../platform/graphql/queries";
import { getMintFees, getPaymentsForUser, getProfileByAddress, getProfileById, getProfiles, getUserTotalGains } from "../profile/graphql";
import { getProposalById } from "../proposals/graphql";
import { getOne } from "../services/graphql/queries";
import { mockGraphQlMintFeesResponse, mockGraphQlProtocolByIdResponse, mockGraphQlUsersResponse, testAddress, testChainId, testGetProfilesResponse, testIpfsHash, testPaymentsByServiceResponse, testPlatformId, testPlatformResponse, testPlatformResponseWithArbitrator, testProposalId, testProposalResponse, testProtocolAndPlatformResponse, testServiceId, testServiceResponse, testUserId, testUserPaymentsResponse, testUserResponse, testUserTotalGainsResponse } from "./fixtures";

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

        if (query === getProtocolAndPlatformsFees(testProposalResponse.data.proposal.service.platform.id, testProposalResponse.data.proposal.platform.id)) {
            return testProtocolAndPlatformResponse;
        }

        if (query === getOne(testServiceId)) {
            return testServiceResponse;
        }

        if (query === getPaymentsByService(testServiceId)) {
            return testPaymentsByServiceResponse;
        }

        return { data: { "racoon": "bar" } };
    })

}

export class MockViemClient {
    writeContract = jest.fn(async () => testAddress)
    readContract = jest.fn(async () => "randomData")
    publicClient = {
        readContract: jest.fn(async () => "randomData")
    }

}

export class MockIPFSClient {
    post = jest.fn().mockResolvedValue(testIpfsHash);
}