import { Profile } from "..";
// DO NOT remove this comments - they are needed for local testing
// import { getGraphQLConfig } from "../../config";
// import GraphQLClient from "../../graphql";
import { getProtocolById } from "../../platform/graphql/queries";
import { MockGraphQLClient, MockIPFSClient, MockViemClient } from "../../__mocks__/clientMocks";
import { mockGraphQlMintFeesResponse, testAddress, testGetProfilesResponse, testIpfsHash, testName, testPlatformId, testProfileData, testUserId, testUserPaymentsResponse, testUserResponse, testUserTotalGainsResponse } from "../../__mocks__/fixtures";
import { getMintFees, getProfileById, getProfiles } from "../graphql";

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

    describe('getById', () => {
        it('should return user based on input it', async () => {
            const userId = testUserId;
            const result = await profile.getById(userId);
            expect(result).toEqual(testUserResponse.data.user);
            expect(mockGraphQLClient.get).toHaveBeenCalledWith(getProfileById(userId));

        })
    })

    describe('update', () => {
        it('should successfully update profile hash and update on contract', async () => {
            const profileData = testProfileData;
            const updateResponse = await profile.update(profileData, testUserId);
            expect(updateResponse.cid).toEqual(testIpfsHash);
            expect(updateResponse.tx).toEqual(testAddress);
            expect(mockViemClient.writeContract).toHaveBeenCalledWith('talentLayerId', 'updateProfileData', [
                testUserId,
                testIpfsHash
            ])
        })
    })

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

    describe('getBy', () => {
        it('should return profiles based on provided parameters', async () => {
            const params = { numberPerPage: 1, offset: 0, searchQuery: 'racoon' };

            const result = await profile.getBy(params);
            expect(mockGraphQLClient.get).toHaveBeenCalledWith(getProfiles(params.numberPerPage, params.offset, params.searchQuery));
            expect(result).toEqual(testGetProfilesResponse);
        });
    });

    describe('getTotalGains', () => {
        it('should return the total gains for a user', async () => {
            const userId = testUserId;
            const result = await profile.getTotalGains(userId);
            expect(result).toEqual(testUserTotalGainsResponse.data.user.totalGains);
        });
    });

    describe('getPayments', () => {
        it('should return payment data for a user', async () => {
            const userId = testUserId;
            const result = await profile.getPayments(userId);
            expect(result).toEqual(testUserPaymentsResponse.data.payments);
        });
    });


});
