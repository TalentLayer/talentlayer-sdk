import { ChainConfig, CustomChainConfig, NetworkEnum } from "../types"

// const isNecklace = (b: Accessory): b is Necklace => {
//     return (b as Necklace).kind !== undefined
// }

export const isCustomChainConfig = (config: ChainConfig): config is CustomChainConfig => {
    return (config as CustomChainConfig).chainDefinition !== undefined;
}

export const isNetworkEnum = (networkId: number): networkId is NetworkEnum => {
    return Object.values(NetworkEnum).includes(networkId);
}