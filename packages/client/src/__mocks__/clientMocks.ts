import { getPlatformById, getProtocolById } from "../platform/graphql/queries";
import { getMintFees, getPaymentsForUser, getProfileByAddress, getProfileById, getProfiles, getUserTotalGains } from "../profile/graphql";
import { mockGraphQlMintFeesResponse, mockGraphQlProtocolByIdResponse, mockGraphQlUsersResponse, testAddress, testGetProfilesResponse, testIpfsHash, testPlatformId, testPlatformResponse, testPlatformResponseWithArbitrator, testUserId, testUserPaymentsResponse, testUserResponse, testUserTotalGainsResponse } from "./fixtures";

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