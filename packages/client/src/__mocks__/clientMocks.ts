import { getProtocolById } from "../platform/graphql/queries";
import { getMintFees, getPaymentsForUser, getProfileByAddress, getProfileById, getProfiles, getUserTotalGains } from "../profile/graphql";
import { mockGraphQlMintFeesResponse, mockGraphQlProtocolByIdResponse, mockGraphQlUsersResponse, testAddress, testGetProfilesResponse, testIpfsHash, testUserId, testUserPaymentsResponse, testUserResponse, testUserTotalGainsResponse } from "./fixtures";

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

        return { data: { "racoon": "bar" } };
    })

}

export class MockViemClient {
    writeContract = jest.fn(async (...args) => {
        console.log("args:", args)
        return testAddress;
    })

}

export class MockIPFSClient {
    post = jest.fn().mockResolvedValue(testIpfsHash);

}