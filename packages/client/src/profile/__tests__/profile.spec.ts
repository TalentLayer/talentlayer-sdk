import { Profile } from "..";
import { MockGraphQLClient, MockIPFSClient, MockViemClient } from "../../__mocks__/clientMocks";
import { testAddress, testIpfsHash, testName, testPlatformId, testProfileData } from "../../__mocks__/fixtures";

describe('Profile', () => {
    let mockGraphQLClient: any;
    let mockViemClient: any;
    let mockIPFSClient: any;
    let profile: Profile;

    beforeEach(() => {
        mockGraphQLClient = new MockGraphQLClient();
        mockViemClient = new MockViemClient();
        mockIPFSClient = new MockIPFSClient();
        profile = new Profile(mockGraphQLClient, mockIPFSClient, mockViemClient, testPlatformId);
    });

    it('constructor initializes correctly', () => {
        expect(profile).toBeInstanceOf(Profile);
    });

    describe('getByAddress', () => {
        it('getByAddress returns data for a given address', async () => {

            const address = testAddress;
            const result = await profile.getByAddress(address);
            expect(result.name).toEqual(testName);
        });
    });

    describe('upload', () => {
        it('should upload profile data and return a string', async () => {
            const result = await profile.upload(testProfileData);
            expect(mockIPFSClient.post).toHaveBeenCalledWith(JSON.stringify(testProfileData));

            expect(result).toBe(testIpfsHash);
        });
    });


});
