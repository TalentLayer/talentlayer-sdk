import { IPFSClientConfig } from '../types';

export default class IPFSClient {

    static readonly IPFS_CLIENT_ERROR = 'IPFS client not initialised'
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

    public async post(data: string): Promise<any> {
        if (this.ipfs) {
            const result = await this.ipfs.add(data);
            return result.path;
        }

        throw Error("IPFS client not intiialised properly");
    }
}