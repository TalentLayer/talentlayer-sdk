import { IPFSClientConfig } from '../types';

export default class IPFSClient {
    ipfs: any;

    constructor(ipfsClientConfig: IPFSClientConfig) {
        const authorization =
            'Basic ' +
            btoa(ipfsClientConfig.infuraClientId + ':' + ipfsClientConfig.infuraClientSecret);
        import('ipfs-http-client')
            .then(({ create }) => {
                this.ipfs = create({
                    url: 'https://infura-ipfs.io:5001/api/v0',
                    headers: {
                        authorization,
                    },
                });
            })


    }

    public async postToIpfs(data: string): Promise<any> {
        if (this.ipfs) {
            const result = await this.ipfs.add(data);
            return result.path;
        }

        throw Error("IPFS client not intiialised properly");
    }
}