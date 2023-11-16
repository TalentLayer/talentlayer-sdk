import { getProtocolById } from "../platform/graphql/queries";
import { getMintFees, getProfileByAddress } from "../profile/graphql";
import { mockGraphQlMintFeesResponse, mockGraphQlProtocolByIdResponse, mockGraphQlUsersResponse, testAddress, testIpfsHash } from "./fixtures";

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