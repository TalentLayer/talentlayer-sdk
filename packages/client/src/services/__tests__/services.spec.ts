
import { Service } from '..';
import { getPlatformById } from '../../platform/graphql/queries';
import { MockGraphQLClient, MockIPFSClient, MockViemClient } from '../../__mocks__/clientMocks';
import {
    testAddress,
    testIpfsHash,
    testPlatformId,
    testPlatformResponse,
    testReferralAmount,
    testSearchServiceProps,
    testSearchServicesResponse,
    testServiceDetails,
    testServiceId,
    testServiceResponse,
    testSignature,
    testUserId
} from '../../__mocks__/fixtures';

describe('Service', () => {
    let service: Service;
    let mockGraphQLClient: any;
    let mockIPFSClient: any;
    let mockViemClient: any;

    beforeEach(() => {
        mockGraphQLClient = new MockGraphQLClient();
        // mockGraphQLClient = new GraphQLClient(getGraphQLConfig(137))
        mockIPFSClient = new MockIPFSClient();
        mockViemClient = new MockViemClient();
        service = new Service(mockGraphQLClient, mockIPFSClient, mockViemClient, testPlatformId, 'example.com');
    });

    describe('getOne', () => {
        it('should return details of a service by id', async () => {
            // Arrange
            const serviceId = testServiceId;

            // Act
            const response = await service.getOne(serviceId);

            // Assert
            expect(response).toEqual(testServiceResponse.data.service)

        })
    })

    describe('create', () => {
        it('should create a new service', async () => {
            // Arrange
            const serviceDetails = testServiceDetails;
            const userId = testUserId;
            const platformID = testPlatformId;
            jest.spyOn(service, 'getServiceSignature').mockResolvedValue(testSignature)

            // Act
            const response = await service.create(serviceDetails, userId, platformID, testAddress, testReferralAmount);

            // Assert
            expect(response.cid).toEqual(testIpfsHash);
            expect(response.tx).toEqual(testAddress);
            expect(mockGraphQLClient.get).toHaveBeenCalledWith(getPlatformById(platformID.toString()));
            expect(mockViemClient.writeContract).toHaveBeenCalledWith(
                'talentLayerService',
                'createService',
                [userId, platformID, testIpfsHash, testSignature, testAddress, testReferralAmount],
                BigInt(testPlatformResponse.data.platform.servicePostingFee),

            );

        })
    })

    describe('update', () => {
        it('should update a new service', async () => {
            // Arrange
            const serviceDetails = testServiceDetails;
            const userId = testUserId;
            const serviceId = 1;
            jest.spyOn(service, 'getServiceSignature').mockResolvedValue(testSignature)

            // Act
            const response = await service.update(serviceDetails, userId, serviceId,testReferralAmount);

            // Assert
            expect(response.cid).toEqual(testIpfsHash);
            expect(response.tx).toEqual(testAddress);
            expect(mockViemClient.writeContract).toHaveBeenCalledWith(
                'talentLayerService',
                'updateService',
                [userId, serviceId, testReferralAmount, testIpfsHash]
            );

        })
    })

    describe('search', () => {
        it('should return services based on criteria', async () => {
            // Arrange
            const props = testSearchServiceProps;

            // Act
            const response = await service.search(props);

            // Assert
            expect(response).toEqual(testSearchServicesResponse)

        })
    })

    describe('getServices', () => {
        it('should return services based on criteria', async () => {
            // Arrange
            const props = testSearchServiceProps;

            // Act
            const response = await service.getServices(props);

            // Assert
            expect(response).toEqual(testSearchServicesResponse)

        })
    })

});
