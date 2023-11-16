export const testAddress = "0xRacoon";
export const testName = 'racoon';
export const testAbout = 'a helpful racoon here to help with tests';
export const testPlatformId = 1;
export const mockGraphQlUsersResponse = { data: { users: [{ name: testName }] } };
export const mockGraphQlMintFeesResponse = {
    data: {
        protocols: [
            {
                userMintFee: '1000000000000000000',
                shortHandlesMaxPrice: '200000000000000000000'
            }
        ]
    }
}


export const mockGraphQlProtocolByIdResponse = {
    data: {
        protocol: {
            id: '1',
            userMintFee: '1000000000000000000',
            platformMintFee: '0',
            protocolEscrowFeeRate: 100,
            totalMintFees: '12929000000000000000000',
            minArbitrationFeeTimeout: '864000',
            shortHandlesMaxPrice: '200000000000000000000',
            minServiceCompletionPercentage: '30'
        }
    }
}
export const testIpfsHash = 'ipfsHash';
export const testProfileData = { name: testName, about: testAbout };