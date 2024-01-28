import { parseEther, toHex } from "viem";
import { Disputes } from "..";
import { getChainConfig, getGraphQLConfig } from "../../config";
import GraphQLClient from "../../graphql";
import { Logger } from "../../logger";
import { getPlatformById } from "../../platform/graphql/queries";
import { MockGraphQLClient, MockViemClient } from "../../__mocks__/clientMocks";
import { testPlatformId, testChainId, testPlatformResponseWithArbitrator, testAddress } from "../../__mocks__/fixtures";


describe('Disputes', () => {
    let mockGraphQLClient: any;
    let mockViemClient: any;
    let disputes: Disputes;
    let logger: Logger;

    beforeEach(() => {
        mockGraphQLClient = new MockGraphQLClient();
        // DO NOT remove this comments - they are needed for local testing
        // mockGraphQLClient = new GraphQLClient(getGraphQLConfig(137))
        mockViemClient = new MockViemClient();
        logger = new Logger('TalentLayer SDK', true);
        disputes = new Disputes(mockViemClient, testPlatformId, mockGraphQLClient, testChainId, logger);
    });

    it('constructor initializes correctly', () => {
        expect(disputes).toBeInstanceOf(Disputes);
    });

    // Test for each method in Disputes class
    describe('getArbitrationCost', () => {
        it('should return 0 if the aribtrator address is set to zeroAddress', async () => {
            // Arrange
            const expectedCost = 0;

            // Act
            const result = await disputes.getArbitrationCost();

            // Assert
            expect(result).toEqual(expectedCost);
            expect(mockGraphQLClient.get).toHaveBeenCalledWith(getPlatformById(testPlatformId.toString()));
        });

        it('should read arbitration contract and return value if arbitrator address is not zero', async () => {
            // Arrange
            // set a new disputes instance with a different platform id
            disputes = new Disputes(mockViemClient, 2, mockGraphQLClient, testChainId, logger);
            const chainConfig = getChainConfig(disputes.chainId);
            const contract = chainConfig.contracts['talentLayerArbitrator'];

            //Act
            await disputes.getArbitrationCost();

            // Assert
            expect(mockViemClient.publicClient.readContract).toHaveBeenCalledWith({ address: testPlatformResponseWithArbitrator.data.platform.arbitrator, abi: contract.abi, functionName: 'arbitrationCost', args: [toHex(disputes.platformID, { size: 32 })] })
        })



    });

    describe('setPrice', () => {
        it('should set the price for arbitration', async () => {
            // Arrange
            const value = 5;
            const expectedTxHash = testAddress;

            // Act
            const result = await disputes.setPrice(value);

            // Assert
            expect(result).toEqual(expectedTxHash);
            // Check if writeContract is called with correct parameters
            expect(mockViemClient.writeContract).toHaveBeenCalledWith(
                'talentLayerArbitrator',
                'setArbitrationPrice',
                [testPlatformId, parseEther(value.toString())]
            );
        });
    });

});

