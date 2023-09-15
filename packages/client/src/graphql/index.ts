import axios from 'axios';
import { GraphQLConfig, GraphQLQuery } from '../types';
export * from './queries';
export default class GraphQLClient {
    config: GraphQLConfig;

    constructor(config: GraphQLConfig) {
        this.config = config
    }

    public async getFromSubgraph(query: GraphQLQuery) {
        let result = {};

        const response = await axios.post(this.config.subgraphUrl, { query });

        if (response.status === 200) {
            return response.data;
        }

        throw (response);

    }

}