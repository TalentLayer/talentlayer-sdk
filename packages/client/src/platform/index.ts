import GraphQLClient from "../graphql";
import { getPlatformById, getPlatformsByOwner } from "./graphql/queries";

export interface IPlatform {
    getOne(id: string): Promise<any>;
}

export class Platform {

    subgraph: GraphQLClient;

    constructor(graphQlClient: GraphQLClient) {
        this.subgraph = graphQlClient;
    }

    public async getOne(id: string): Promise<any> {
        const response = await this.subgraph.get(getPlatformById(id));


        if (response?.data?.platform) {
            return response?.data?.platform;
        }

        return null;
    }

    public async getByOwner(address: `0x${string}`): Promise<any> {
        const response = await this.subgraph.get(getPlatformsByOwner(address));

        if (response?.data?.platforms) {
            return response?.data?.platforms;
        }

        return [];
    }
}