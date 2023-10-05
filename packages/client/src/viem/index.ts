import { createWalletClient, createPublicClient, custom, http, WalletClient, createClient, PublicClient } from "viem";
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { getChainConfig } from "../config";
import { NetworkEnum, ViemClientConfig } from "../types";
import TalentLayerID from "../contracts/ABI/TalentLayerID.json"
import { chains } from "../blockchain-bindings/chains";

export class ViemClient {
    client: WalletClient;
    publicClient: PublicClient;
    chainId: NetworkEnum;

    constructor(config: ViemClientConfig) {

        // if chainId is not provided, set it to mumbai
        this.chainId = config.chainId || NetworkEnum.MUMBAI;

        // initialise a default public wallet client;
        this.client = createWalletClient({
            chain: chains[this.chainId],
            transport: http()
        })
        this.publicClient = createPublicClient({
            chain: chains[this.chainId],
            transport: http()
        })

        // attempt to override the public client based on
        // config provided by the consumer
        this.setupViemClient(config);
    }

    setupViemClient(config: ViemClientConfig): boolean {

        const rpcUrl = config?.rpcUrl;
        const transportProtocol = rpcUrl ? http(rpcUrl) : http();

        if (config?.privateKey) {
            const account = privateKeyToAccount(config.privateKey);
            this.client = createWalletClient({
                account,
                chain: chains[this.chainId],
                transport: transportProtocol
            })

            return true;
        }

        if (config?.mnemonic) {
            const account = mnemonicToAccount(config.mnemonic);
            this.client = createWalletClient({
                account,
                chain: chains[this.chainId],
                transport: transportProtocol
            })

            return true;
        }

        // @ts-ignore
        let browserProvider = globalThis?.ethereum || window?.ethereum;
        if (browserProvider) {
            this.client = createWalletClient({
                chain: chains[this.chainId],
                transport: custom(browserProvider)
            });
            return true;
        }

        return false;
    }

    public async writeContract(contractName: string, functionName: string, args: Array<any>, value?: bigint) {
        // @ts-ignore
        const [address] = await this.client.getAddresses()

        if (!address) {
            throw Error("Wallet Client not initialised properly");
        }

        const chainConfig = getChainConfig(this.chainId);
        const contract = chainConfig.contracts[contractName];

        if (!contract) {
            throw Error(`Invalid contract name passed. ${contractName}`);
        }

        console.log("SDK: simulating contract call");
        // @ts-ignore
        const { request } = await this.publicClient.simulateContract({
            address: contract.address,
            abi: contract.abi,
            functionName,
            args,
            account: address,
            value
        })

        console.log("SDK: executing contract call with request", request);
        // @ts-ignore
        return this.client.writeContract(request);

    }

    public async readContract(contractName: string, functionName: string, args: Array<any>) {
        const chainConfig = getChainConfig(this.chainId);
        const contract = chainConfig.contracts[contractName];

        console.log("SDK: reading contract", contract);
        if (!contract) {
            throw Error("Invalid contract name passed.");
        }

        // @ts-ignore
        return this.publicClient.readContract({
            address: contract.address,
            abi: contract.abi,
            functionName,
            args
        })
    }

    public async updateProfileData(userId: string, cid: string) {
        // @ts-ignore
        const [address] = await this.client.getAddresses()

        if (!address) {
            throw Error("Wallet Client not initialised properly");
        }

        const chainConfig = getChainConfig(this.chainId);

        // @ts-ignore
        return this.client.writeContract({
            address: chainConfig.contracts.talentLayerId.address,
            abi: TalentLayerID.abi,
            functionName: 'updateProfileData',
            args: [userId, cid],
            account: address
        });
    }
};