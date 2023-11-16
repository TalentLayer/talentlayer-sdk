import { Profile } from "..";
// DO NOT remove this comments - they are needed for local testing
// import { getGraphQLConfig } from "../../config";
// import GraphQLClient from "../../graphql";
import { getProtocolById } from "../../platform/graphql/queries";
import { MockGraphQLClient, MockIPFSClient, MockViemClient } from "../../__mocks__/clientMocks";
import { mockGraphQlMintFeesResponse, testAddress, testIpfsHash, testName, testPlatformId, testProfileData } from "../../__mocks__/fixtures";
import { getMintFees } from "../graphql";

describe('Profile', () => {
    let mockGraphQLClient: any;
    let mockViemClient: any;
    let mockIPFSClient: any;
    let profile: Profile;

    beforeEach(() => {
        mockGraphQLClient = new MockGraphQLClient();
        // DO NOT remove this comments - they are needed for local testing
        // mockGraphQLClient = new GraphQLClient(getGraphQLConfig(137))
        mockViemClient = new MockViemClient();
        mockIPFSClient = new MockIPFSClient();
        profile = new Profile(mockGraphQLClient, mockIPFSClient, mockViemClient, testPlatformId);
    });

    it('constructor initializes correctly', () => {
        expect(profile).toBeInstanceOf(Profile);
    });

    describe('create', () => {
        it('should create a new profile and return a response', async () => {
            const handle = testName;
            const result = await profile.create(handle);
            expect(mockGraphQLClient.get).toHaveBeenCalledWith(getProtocolById(1));
            expect(mockViemClient.writeContract).toHaveBeenCalledWith('talentLayerId', 'mint', ['1', 'racoon'], BigInt("1000000000000000000"))
        })
    })

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

    describe('getMintFees', () => {
        it('should return mint fees', async () => {
            const result = await profile.getMintFees();
            expect(mockGraphQLClient.get).toHaveBeenCalledWith(getMintFees());
            expect(result).toEqual(mockGraphQlMintFeesResponse.data);
        });
    });


});
