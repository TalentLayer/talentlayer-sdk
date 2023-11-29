import { ServiceStatusEnum } from "../services/enums";
import { IProps } from "../services/types";

export const testAddress = "0xRacoon";
export const testName = 'racoon';
export const testUserId = '2371';
export const testChainId = 137;
export const testUserResponse = {
    data: {
        user: {
            id: '1',
            address: '0x870b08a222f8eac75b6bf85988df7597c0ae20a9',
            handle: 'talentlayer',
            rating: '0',
            delegates: [],
            userStat: { numReceivedReviews: '0' },
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
export const testIpfsHash = 'abcd';
export const testCid = testIpfsHash;
export const testProfileData = { name: testName, about: testAbout };
export const testGetProfilesResponse = { "data": { "users": [{ "id": "11962", "address": "0x02289d0ebf8836e6f98af170b88b9f8eb889e2c6", "handle": "racoon", "userStat": { "numReceivedReviews": "0" }, "rating": "0" }] } }
export const testUserTotalGainsResponse = { data: { user: { totalGains: [{ "id": "2371-0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "totalGain": "850000000", "token": { "id": "0xracoon", "name": "USD Coin (PoS)", "symbol": "USDC", "decimals": "6" } }] } } }
export const testUserPaymentsResponse = { data: { payments: [{ "id": "0x3eb5973863d712ce78dc757af04ca24a81d0376dbce604d002779475428e4a85-975", "rateToken": { "address": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "decimals": "6", "name": "USD Coin (PoS)", "symbol": "USDC" }, "amount": "850000000", "transactionHash": "0x3eb5973863d712ce78dc757af04ca24a81d0376dbce604d002779475428e4a85", "paymentType": "Release", "createdAt": "1699361940", "service": { "id": "75", "cid": "abcd" } }] } }

export const testPlatformResponse = { "data": { "platform": { "id": "1", "address": "0xracoon", "name": "abcd", "createdAt": "1681454011", "updatedAt": "1681454011", "originServiceFeeRate": 0, "originValidatedProposalFeeRate": 0, "servicePostingFee": "0", "proposalPostingFee": "0", "arbitrator": "0x0000000000000000000000000000000000000000", "arbitratorExtraData": "0x00000000", "arbitrationFeeTimeout": "864000", "cid": null, "signer": "0xraqcoon", "description": null } } }

export const testPlatformResponseWithArbitrator = { "data": { "platform": { "id": "1", "address": "0xracoon", "name": "abcd", "createdAt": "1681454011", "updatedAt": "1681454011", "originServiceFeeRate": 0, "originValidatedProposalFeeRate": 0, "servicePostingFee": "0", "proposalPostingFee": "0", "arbitrator": "0xracoon", "arbitratorExtraData": "0x00000000", "arbitrationFeeTimeout": "864000", "cid": null, "signer": "0xraqcoon", "description": null } } }
export const testProposalId = '12-83';
export const testProposalIdWithDifferentRateToken = '12-84';
export const testProposalResponse = { "data": { "proposal": { "id": testProposalId, "seller": { "id": "83", "handle": "maartenvantwout", "address": "0x9c8ca52fa6f12fd7b70c6b6e9a2704149af676ea", "cid": "QmWm6biFCf1GwNj7u78ub7c1dgPDHphd285KzmtddYWQu9", "rating": "0", "userStat": { "numReceivedReviews": "0" } }, "platform": { "id": "1" }, "service": { "id": "12", "platform": { "id": "1" } }, "cid": "abcd", "rateToken": { "address": "0x0000000000000000000000000000000000000000" }, "rateAmount": "10000000000000000000", "description": { "about": "I would love to do this job", "video_url": null }, "status": "Validated", "expirationDate": "1685796297" } } };
export const testProposalResponseWithDifferentRateToken = { "data": { "proposal": { "id": testProposalId, "seller": { "id": "83", "handle": "maartenvantwout", "address": "0x9c8ca52fa6f12fd7b70c6b6e9a2704149af676ea", "cid": "QmWm6biFCf1GwNj7u78ub7c1dgPDHphd285KzmtddYWQu9", "rating": "0", "userStat": { "numReceivedReviews": "0" } }, "platform": { "id": "1" }, "service": { "id": "12", "platform": { "id": "1" } }, "cid": "abcd", "rateToken": { "address": testAddress }, "rateAmount": "10000000000000000000", "description": { "about": "I would love to do this job", "video_url": null }, "status": "Validated", "expirationDate": "1685796297" } } }
export const testProtocolAndPlatformResponse = { "data": { "protocols": [{ "protocolEscrowFeeRate": 100 }], "servicePlatform": { "originServiceFeeRate": 0 }, "proposalPlatform": { "originValidatedProposalFeeRate": 0 } } }
export const testServiceId = '12'; // rest to 12 before comitting
export const testAmount = BigInt('1000');
export const testServiceResponse = { "data": { "service": { "id": "12", "status": "Finished", "createdAt": "1683203526", "cid": "QmdZhsfn1BhE3shW8TeR4f22MCG7nTWTtT55NkwH6McWfJ", "transaction": { "id": "2" }, "buyer": { "id": "11207", "handle": "0xrik", "address": "0x946f0711dfea25dc2ab60e6ff0df6dbda32ee6c6", "rating": "0", "userStat": { "numReceivedReviews": "0" } }, "seller": { "id": "83", "handle": "maartenvantwout" }, "proposals": [{ "id": "12-83" }], "validatedProposal": [{ "id": "12-83", "rateToken": { "address": "0x0000000000000000000000000000000000000000", "decimals": "18", "name": "Polygon", "symbol": "MATIC" }, "rateAmount": "10000000000000000000" }], "description": { "id": "QmdZhsfn1BhE3shW8TeR4f22MCG7nTWTtT55NkwH6McWfJ-1683203526", "title": "Create a logo", "video_url": null, "about": "Create a logo for our company", "startDate": null, "expectedEndDate": null, "rateAmount": "1000000000000000000", "rateToken": "0x0000000000000000000000000000000000000000", "keywords_raw": "ux/ui,3d graphic design software", "keywords": [] } } } };
export const testSearchServicesResponse = { data: { "services": [{ "id": "12", "status": "Finished", "createdAt": "1683203526", "cid": "QmdZhsfn1BhE3shW8TeR4f22MCG7nTWTtT55NkwH6McWfJ", "transaction": { "id": "2" }, "buyer": { "id": "11207", "handle": "0xrik", "address": "0x946f0711dfea25dc2ab60e6ff0df6dbda32ee6c6", "rating": "0", "userStat": { "numReceivedReviews": "0" } }, "seller": { "id": "83", "handle": "maartenvantwout" }, "proposals": [{ "id": "12-83" }], "validatedProposal": [{ "id": "12-83", "rateToken": { "address": "0x0000000000000000000000000000000000000000", "decimals": "18", "name": "Polygon", "symbol": "MATIC" }, "rateAmount": "10000000000000000000" }], "description": { "id": "QmdZhsfn1BhE3shW8TeR4f22MCG7nTWTtT55NkwH6McWfJ-1683203526", "title": "Create a logo", "video_url": null, "about": "Create a logo for our company", "startDate": null, "expectedEndDate": null, "rateAmount": "1000000000000000000", "rateToken": "0x0000000000000000000000000000000000000000", "keywords_raw": "ux/ui,3d graphic design software", "keywords": [] } }] } }
export const testServiceDetails = {
    title: 'test title',
    about: 'test about',
    keywords: 'web3,racoon',
    rateToken: testAddress,
    rateAmount: testAmount.toString()
}
export const testPaymentsByServiceResponse = { "data": { "payments": [{ "id": "0xbae7cb57cef86c17a0ca0ca9af0f1b845912fe65448169f0a93a15e5e6dfae25-200", "amount": "10000000000000000000", "rateToken": { "address": "0x0000000000000000000000000000000000000000", "decimals": "18", "name": "Polygon", "symbol": "MATIC" }, "paymentType": "Release", "transactionHash": "0xbae7cb57cef86c17a0ca0ca9af0f1b845912fe65448169f0a93a15e5e6dfae25", "createdAt": "1683204479" }] } }
export const testPlatformDetails = {
    about: 'test data',
    website: 'example.com',
    video_url: 'example.com',
    image_url: 'example.com'
}

export const testOwnerAddress = '0xOwnerAddress';
export const testPlatformsByOwnerResponse = { "data": { "platforms": [{ "id": "1", "address": "0x4444444e2f8ccd0e323c959b02a93561b911f9b6", "name": "workx", "createdAt": "1681454011", "updatedAt": "1681454011", "originServiceFeeRate": 0, "originValidatedProposalFeeRate": 0, "servicePostingFee": "0", "proposalPostingFee": "0", "arbitrator": "0x0000000000000000000000000000000000000000", "arbitratorExtraData": "0x00000000", "arbitrationFeeTimeout": "864000", "cid": null, "signer": "0x4444444e2f8ccd0e323c959b02a93561b911f9b6", "description": null }] } }
export const testProposalsByServiceId = { "data": { "proposals": [{ "id": testProposalId, "seller": { "id": "83", "handle": "maartenvantwout", "address": "0x9c8ca52fa6f12fd7b70c6b6e9a2704149af676ea", "cid": "QmWm6biFCf1GwNj7u78ub7c1dgPDHphd285KzmtddYWQu9", "rating": "0", "userStat": { "numReceivedReviews": "0" } }, "platform": { "id": "1" }, "service": { "id": "12", "platform": { "id": "1" } }, "cid": "abcd", "rateToken": { "address": "0x0000000000000000000000000000000000000000" }, "rateAmount": "10000000000000000000", "description": { "about": "I would love to do this job", "video_url": null }, "status": "Validated", "expirationDate": "1685796297" }] } }
export const testProposalsByUser = { "data": { "proposals": [{ "id": testProposalId, "seller": { "id": "83", "handle": "maartenvantwout", "address": "0x9c8ca52fa6f12fd7b70c6b6e9a2704149af676ea", "cid": "QmWm6biFCf1GwNj7u78ub7c1dgPDHphd285KzmtddYWQu9", "rating": "0", "userStat": { "numReceivedReviews": "0" } }, "platform": { "id": "1" }, "service": { "id": "12", "platform": { "id": "1" } }, "cid": "abcd", "rateToken": { "address": "0x0000000000000000000000000000000000000000" }, "rateAmount": "10000000000000000000", "description": { "about": "I would love to do this job", "video_url": null }, "status": "Validated", "expirationDate": "1685796297" }] } }
export const testProposalDetails = { about: 'test about', video_url: 'hello world' }
export const testExpirationDate = '123456';
export const testSignature = '';
export const testSearchServiceProps: IProps = {
    serviceStatus: ServiceStatusEnum.Opened
}
export const testMetaEvidenceCid = 'testMetaEvidenceCid';

export const testReviewDetails = {
    content: 'test content',
    rating: 1
}

export const testReviewsByService = {
    data: { "reviews": [{ "id": "2", "rating": "5", "createdAt": "1680027301", "service": { "id": "1", "status": "Finished" }, "to": { "id": "1", "handle": "thomas" }, "description": { "id": "QmRN1ZBFAkSXX34YBd6JrVaSNJWLmt7UVPXvTuXfH2dmUq-1680027301", "content": "Top :)" } }, { "id": "1", "rating": "5", "createdAt": "1680027235", "service": { "id": "1", "status": "Finished" }, "to": { "id": "2", "handle": "migmig" }, "description": { "id": "QmW612hUxvg1SigPA5Y3msuBEuXfLaH3axp22dr1kwCXp8-1680027235", "content": "Perfect!" } }] }
}