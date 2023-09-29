import { AddressZero } from "./constants";
import { Config, GraphQLConfig, NetworkEnum } from "./types";
import TalentLayerID from "./contracts/ABI/TalentLayerID.json"
import TalerLayerService from "./contracts/ABI/TalentLayerService.json"
import TalentLayerReview from "./contracts/ABI/TalentLayerReview.json"
import TalentLayerEscrow from "./contracts/ABI/TalentLayerEscrow.json"
import TalentLayerPlatformID from "./contracts/ABI/TalentLayerPlatformID.json"
import TalentLayerArbitrator from "./contracts/ABI/TalentLayerArbitrator.json"


export const contracts: { [key: string]: { address: `0x${string}`, abi: any } } = {
    talentLayerId: {
        address: '0x3F87289e6Ec2D05C32d8A74CCfb30773fF549306',
        abi: TalentLayerID.abi
    },
    talentLayerService: {
        address: "0x27ED516dC1df64b4c1517A64aa2Bb72a434a5A6D",
        abi: TalerLayerService.abi
    },
    talentLayerReview: {
        address: '0x050F59E1871d3B7ca97e6fb9DCE64b3818b14B18',
        abi: TalentLayerReview.abi
    },
    talentLayerEscrow: {
        address: '0x4bE920eC3e8552292B2147480111063E0dc36872',
        abi: TalentLayerEscrow.abi
    },
    talentLayerPlatformId: {
        address: '0xEFD8dbC421380Ee04BAdB69216a0FD97F64CbFD4',
        abi: TalentLayerPlatformID.abi
    },
    talentLayerArbitrator: {
        address: '0xd6eCCD00F4F411CDf3DCc3009164d0C388b18fd1',
        abi: TalentLayerArbitrator.abi
    },
}

const mumbai: Config = {
    networkId: NetworkEnum.MUMBAI,
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-mumbai',
    contracts: {
        talentLayerId: {
            address: "0x3F87289e6Ec2D05C32d8A74CCfb30773fF549306",
            abi: TalentLayerID.abi
        },
        talentLayerService: {
            address: "0x27ED516dC1df64b4c1517A64aa2Bb72a434a5A6D",
            abi: TalerLayerService.abi
        },
        talentLayerReview: {
            address: '0x050F59E1871d3B7ca97e6fb9DCE64b3818b14B18',
            abi: TalentLayerReview.abi
        },
        talentLayerEscrow: {
            address: '0x4bE920eC3e8552292B2147480111063E0dc36872',
            abi: TalentLayerEscrow.abi
        },
        talentLayerPlatformId: {
            address: '0xEFD8dbC421380Ee04BAdB69216a0FD97F64CbFD4',
            abi: TalentLayerPlatformID.abi
        },
        talentLayerArbitrator: {
            address: '0xd6eCCD00F4F411CDf3DCc3009164d0C388b18fd1',
            abi: TalentLayerArbitrator.abi
        },
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

const iexec: Config = {
    networkId: NetworkEnum.IEXEC,
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-mumbai',
    contracts: {
        talentLayerId: {
            address: '0xC51537E03f56650C63A9Feca4cCb5a039c77c822',
            abi: TalentLayerID.abi
        },
        talentLayerService: {
            address: "0x45E8F869Fd316741A9316f39bF09AD03Df88496f",
            abi: TalerLayerService.abi
        },
        talentLayerReview: {
            address: '0x6A5BF452108DA389B7B38284E871f538671Ad375',
            abi: TalentLayerReview.abi
        },
        talentLayerEscrow: {
            address: '0x7A534501a6e63448EBC691f27B27B76d4F9b7E17',
            abi: TalentLayerEscrow.abi
        },
        talentLayerPlatformId: {
            address: '0x05D8A2E01EB06c284ECBae607A2d0c2BE946Bf49',
            abi: TalentLayerPlatformID.abi
        },
        talentLayerArbitrator: {
            address: '0x24cEd045b50cF811862B1c33dC6B1fbC8358F521',
            abi: TalentLayerArbitrator.abi
        },
    },
    escrowConfig: {
        adminFee: '0',
        adminWallet: '0x2E6f7222d4d7A71B05E7C35389d23C3dB400851f',
        timeoutPayment: 3600 * 24 * 7,
    },
    tokens: {
        ['0x0000000000000000000000000000000000000000']: {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'RLC',
            name: 'iExec RLC',
            decimals: 18,
        },
        '0xe62C28709E4F19Bae592a716b891A9B76bf897E4': {
            address: '0xe62C28709E4F19Bae592a716b891A9B76bf897E4',
            symbol: 'SERC20',
            name: 'SimpleERC20',
            decimals: 18,
        },
    },
};

const local: Config = {
    networkId: NetworkEnum.LOCAL,
    subgraphUrl: 'http://localhost:8020/',
    contracts: {
        talentLayerId: {
            address: '0x3F87289e6Ec2D05C32d8A74CCfb30773fF549306',
            abi: TalentLayerID.abi
        },
        talentLayerService: {
            address: "0x27ED516dC1df64b4c1517A64aa2Bb72a434a5A6D",
            abi: TalerLayerService.abi
        },
        talentLayerReview: {
            address: '0x050F59E1871d3B7ca97e6fb9DCE64b3818b14B18',
            abi: TalentLayerReview.abi
        },
        talentLayerEscrow: {
            address: '0x4bE920eC3e8552292B2147480111063E0dc36872',
            abi: TalentLayerEscrow.abi
        },
        talentLayerPlatformId: {
            address: '0xEFD8dbC421380Ee04BAdB69216a0FD97F64CbFD4',
            abi: TalentLayerPlatformID.abi
        },
        talentLayerArbitrator: {
            address: '0xd6eCCD00F4F411CDf3DCc3009164d0C388b18fd1',
            abi: TalentLayerArbitrator.abi
        },
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
    [NetworkEnum.IEXEC]: iexec,
};

export const getChainConfig = (networkId: NetworkEnum) => chains[networkId];

export const getGraphQLConfig = (chainId: NetworkEnum): GraphQLConfig => {
    return {
        chainId,
        subgraphUrl: getChainConfig(chainId).subgraphUrl
    }
}

export { chains }