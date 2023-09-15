import { Config, GraphQLConfig, NetworkEnum } from "./types";


export const AddressZero = "0x0000000000000000000000000000000000000000";

const mumbai: Config = {
    networkId: NetworkEnum.MUMBAI,
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-mumbai',
    contracts: {
        talentLayerId: '0x3F87289e6Ec2D05C32d8A74CCfb30773fF549306',
        serviceRegistry: '0x27ED516dC1df64b4c1517A64aa2Bb72a434a5A6D',
        talentLayerReview: '0x050F59E1871d3B7ca97e6fb9DCE64b3818b14B18',
        talentLayerEscrow: '0x4bE920eC3e8552292B2147480111063E0dc36872',
        talentLayerPlatformId: '0xEFD8dbC421380Ee04BAdB69216a0FD97F64CbFD4',
        talentLayerArbitrator: '0xd6eCCD00F4F411CDf3DCc3009164d0C388b18fd1',
    },
    escrowConfig: {
        adminFee: '0',
        adminWallet: '0xC01FcDfDE3B2ABA1eab76731493C617FfAED2F10',
        timeoutPayment: 3600 * 24 * 7,
    },
    tokens: {
        [AddressZero]: {
            address: AddressZero,
            symbol: 'MATIC',
            name: 'Matic',
            decimals: 18,
        },
        '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747': {
            address: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
            symbol: 'USDC',
            name: 'USDC Stablecoin',
            decimals: 6,
        },
    },
};

const local: Config = {
    networkId: NetworkEnum.LOCAL,
    subgraphUrl: 'http://localhost:8020/',
    contracts: {
        talentLayerId: '0x3F87289e6Ec2D05C32d8A74CCfb30773fF549306',
        serviceRegistry: '0x27ED516dC1df64b4c1517A64aa2Bb72a434a5A6D',
        talentLayerReview: '0x050F59E1871d3B7ca97e6fb9DCE64b3818b14B18',
        talentLayerEscrow: '0x4bE920eC3e8552292B2147480111063E0dc36872',
        talentLayerPlatformId: '0xEFD8dbC421380Ee04BAdB69216a0FD97F64CbFD4',
        talentLayerArbitrator: '0xd6eCCD00F4F411CDf3DCc3009164d0C388b18fd1',
    },
    escrowConfig: {
        timeoutPayment: 3600 * 24 * 7,
    },
    tokens: {
        [AddressZero]: {
            address: AddressZero,
            symbol: 'ETH',
            name: 'ETH',
            decimals: 18,
        },
        '0xfF695df29837B571c4DAE01B5711500f6306E93f': {
            address: '0xfF695df29837B571c4DAE01B5711500f6306E93f',
            symbol: 'ERC20',
            name: 'Simple ERC20',
            decimals: 18,
        },
    },
};
const chains: { [networkId in NetworkEnum]: Config } = {
    [NetworkEnum.LOCAL]: local,
    [NetworkEnum.MUMBAI]: mumbai,
};

export const getChainConfig = (networkId: NetworkEnum) => chains[networkId];

export const getGraphQLConfig = (chainId: NetworkEnum): GraphQLConfig => {
    return {
        chainId,
        subgraphUrl: getChainConfig(chainId).subgraphUrl
    }
}






export { chains }