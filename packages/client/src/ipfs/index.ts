import axios from "axios";
import { IPFSClientConfig } from "../types";

export default class IPFSClient {
  static readonly IPFS_CLIENT_ERROR = "IPFS client not initialised";
  ipfs: any;
  authorization: any;

  constructor(ipfsClientConfig: IPFSClientConfig) {
    const authorization =
      "Basic " +
      btoa(ipfsClientConfig.clientId + ":" + ipfsClientConfig.clientSecret);
    this.authorization = authorization;
    import("ipfs-http-client").then(({ create }) => {
      this.ipfs = create({
        url: ipfsClientConfig.baseUrl,
        headers: {
          authorization,
        },
      });
    });
  }

  public async post(data: string): Promise<any> {
    const formData = new FormData();
    formData.append("file", new Blob([data], { type: "application/json" }));

    if (this.ipfs) {
      const result = await this.ipfs.add(data);
      return result.path;
    }

    throw Error("IPFS client not intiialised properly");
  }
}
