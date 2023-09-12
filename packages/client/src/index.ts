import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'

export class TalentLayerClient {
    public async fetchServicesById(id: number): Promise<number> {
        return Promise.resolve(1);
    }
}