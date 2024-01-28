
import { parseEther } from 'viem';
import { Platform } from '..';
import { getChainConfig, getGraphQLConfig } from '../../config';
import { FEE_RATE_DIVIDER } from '../../constants';
import { Logger } from '../../logger';
import { MockGraphQLClient, MockIPFSClient, MockViemClient } from '../../__mocks__/clientMocks';
import { testAddress, testChainId, testCid, testIpfsHash, testOwnerAddress, testPlatformDetails, testPlatformId, testPlatformResponse, testPlatformsByOwnerResponse, testProtocolAndPlatformResponse } from '../../__mocks__/fixtures';
import { getPlatformById } from '../graphql/queries';

describe('Platform', () => {
    let platform: Platform;
    let mockGraphQLClient: any;
    let mockIPFSClient: any;
    let mockViemClient: any;
    let logger: Logger;

    beforeEach(() => {
        mockGraphQLClient = new MockGraphQLClient();
        mockIPFSClient = new MockIPFSClient();
        mockViemClient = new MockViemClient();
        logger = new Logger('TalentLayer SDK', true);
        platform = new Platform(mockGraphQLClient, mockViemClient, testPlatformId, mockIPFSClient, logger);
    });

    describe('getOne', () => {
        it('should fetch and return platform details', async () => {
            // Arrange and Act
            const platformDetails = await platform.getOne(testPlatformId.toString());

            // Assert
            expect(platformDetails).toBeDefined();
            expect(mockGraphQLClient.get).toHaveBeenCalledWith(getPlatformById(testPlatformId.toString()));
            expect(platformDetails).toEqual(testPlatformResponse.data.platform);
        });
    });

    describe('upload', () => {
        it('should upload platform details to IPFS', async () => {
            // Arrange - Platform details to upload

            // Act
            const cid = await platform.upload(testPlatformDetails);

            // Assert
            expect(cid).toEqual(testIpfsHash)
        });

    });

    describe('getByOwner', () => {
        it('should retrieve platforms for a given owner address', async () => {
            // Arrange - Owner's address
            const ownerAddress = testOwnerAddress;

            // Act
            const platforms = await platform.getByOwner(ownerAddress);

            // Assert
            expect(platforms).toEqual(testPlatformsByOwnerResponse.data.platforms);
        });
    });

    describe('update', () => {
        it('should update the platform details', async () => {
            // Arrange
            const platformDetails = testPlatformDetails;

            // Act
            const result = await platform.update(platformDetails);

            // Assert
            expect(result.cid).toEqual(testIpfsHash);
            expect(result.tx).toEqual(testAddress);

        })
    })

    describe('setFeeTimeout', () => {
        it('should set the arbitration fee timeout of the platform', async () => {
            // Arrange
            const timeout = 1;

            // Act
            const result = await platform.setFeeTimeout(timeout);

            // Assert
            expect(mockViemClient.writeContract).toHaveBeenCalledWith('talentLayerPlatformId',
                'updateArbitrationFeeTimeout',
                [testPlatformId, timeout]);
            expect(result).toEqual(testAddress);

        })
    })

    describe('updateOriginServiceFeeRate', () => {
        it('should update the origin platform service fee rate', async () => {
            // Arrange
            const feeRate = 1;
            const transformedFeeRate = Math.round((Number(feeRate) * FEE_RATE_DIVIDER) / 100);

            // Act
            const result = await platform.updateOriginServiceFeeRate(feeRate);

            // Assert
            expect(mockViemClient.writeContract).toHaveBeenCalledWith('talentLayerPlatformId',
                'updateOriginServiceFeeRate',
                [testPlatformId, transformedFeeRate]);
            expect(result).toEqual(testAddress);

        })
    })

    describe('updateOriginValidatedProposalFeeRate', () => {
        it('should update the origin platform validated proposal fee rate', async () => {
            // Arrange
            const feeRate = 1;
            const transformedFeeRate = Math.round((Number(feeRate) * FEE_RATE_DIVIDER) / 100);

            // Act
            const result = await platform.updateOriginValidatedProposalFeeRate(feeRate);

            // Assert
            expect(mockViemClient.writeContract).toHaveBeenCalledWith('talentLayerPlatformId',
                'updateOriginValidatedProposalFeeRate',
                [testPlatformId, transformedFeeRate]);
            expect(result).toEqual(testAddress);

        })
    })

    describe('updateArbitrator', () => {
        it('should update the arbitrator of the platform', async () => {
            // Arrange
            const chainConfig = getChainConfig(testChainId);
            const contract = chainConfig.contracts['talentLayerArbitrator'];
            const talentLayerArbitratorAddress = contract.address;

            // Act
            const response = await platform.updateArbitrator(talentLayerArbitratorAddress);

            // Assert
            expect(mockViemClient.writeContract).toHaveBeenLastCalledWith(
                'talentLayerPlatformId',
                'updateArbitrator',
                [testPlatformId, talentLayerArbitratorAddress, '']
            )
            expect(response).toEqual(testAddress);

        })
    })

    describe('updateServicePostingFee', () => {
        it('should update the platform service posting fee rate', async () => {
            // Arrange
            const feeRate = 1;
            const transformedFeeRate = parseEther(feeRate.toString());

            // Act
            const result = await platform.updateServicePostingFee(feeRate);

            // Assert
            expect(mockViemClient.writeContract).toHaveBeenCalledWith('talentLayerPlatformId',
                'updateServicePostingFee',
                [testPlatformId, transformedFeeRate]);
            expect(result).toEqual(testAddress);

        })
    })

    describe('updateProposalPostingFee', () => {
        it('should update the platform proposal posting fee rate', async () => {
            // Arrange
            const feeRate = 1;
            const transformedFeeRate = parseEther(feeRate.toString());

            // Act
            const result = await platform.updateProposalPostingFee(feeRate);

            // Assert
            expect(mockViemClient.writeContract).toHaveBeenCalledWith('talentLayerPlatformId',
                'updateProposalPostingFee',
                [testPlatformId, transformedFeeRate]);
            expect(result).toEqual(testAddress);

        })
    })
});
