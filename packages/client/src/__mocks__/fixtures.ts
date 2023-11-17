export const testAddress = "0xRacoon";
export const testName = 'racoon';
export const testUserId = '2371';
export const testUserResponse = {
    data: {
        user: {
            id: '1',
            address: '0x870b08a222f8eac75b6bf85988df7597c0ae20a9',
            handle: 'talentlayer',
            rating: '0',
            delegates: [],
            userStats: { numReceivedReviews: '0' },
            updatedAt: '1680621215',
            createdAt: '1680608213',
            description: {
                about: 'TalentLayer is composable, decentralized, open-source infrastructure for talent markets; allowing anyone to easily build interoperable gig marketplaces.',
                role: 'buyer',
                name: 'TalentLayer',
                country: null,
                headline: null,
                id: 'QmeTSoJnRNZ6WNeVa5mQ2rkdfALjy4EdyLgTyYyq2AWDAn-1680621215',
                image_url: null,
                video_url: null,
                title: 'Future of work builder',
                timezone: null,
                skills_raw: 'solidity,blockchain',
                web3mailPreferences: null
            }
        }
    }
}
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
export const testGetProfilesResponse = { "data": { "users": [{ "id": "11962", "address": "0x02289d0ebf8836e6f98af170b88b9f8eb889e2c6", "handle": "racoon", "userStats": { "numReceivedReviews": "0" }, "rating": "0" }] } }
export const testUserTotalGainsResponse = { data: { user: { totalGains: [{ "id": "2371-0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "totalGain": "850000000", "token": { "id": "0xracoon", "name": "USD Coin (PoS)", "symbol": "USDC", "decimals": "6" } }] } } }
export const testUserPaymentsResponse = { data: { payments: [{ "id": "0x3eb5973863d712ce78dc757af04ca24a81d0376dbce604d002779475428e4a85-975", "rateToken": { "address": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "decimals": "6", "name": "USD Coin (PoS)", "symbol": "USDC" }, "amount": "850000000", "transactionHash": "0x3eb5973863d712ce78dc757af04ca24a81d0376dbce604d002779475428e4a85", "paymentType": "Release", "createdAt": "1699361940", "service": { "id": "75", "cid": "abcd" } }] } }