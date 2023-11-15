import { getProfileByAddress } from "../profile/graphql";
import { mockGraphQlUsersResponse, testAddress, testIpfsHash } from "./fixtures";

export class MockGraphQLClient {
    async get(query: string) {
        if (query === getProfileByAddress(testAddress)) {
            return mockGraphQlUsersResponse;
        }
        // Mock response based on the query
        return { data: { "racoon": "bar" } };
    }
}

export class MockViemClient {
    // Add methods that are used in the Profile class
    async writeContract(/* parameters */) {
        // Mock response for writeContract
        return testAddress;
    }
}

export class MockIPFSClient {
    post = jest.fn().mockResolvedValue(testIpfsHash);

}