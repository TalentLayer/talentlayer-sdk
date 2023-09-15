import { Axios } from 'axios';
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { getGraphQLConfig } from './config';
import GraphQLClient, { serviceQueryFields, serviceDescriptionQueryFields } from './graphql';
import { NetworkEnum } from './types';

export class TalentLayerClient {
    graphQlClient: GraphQLClient
    constructor(chainId: NetworkEnum) {
        this.graphQlClient = new GraphQLClient(getGraphQLConfig(chainId))
    }

    // TODO: replace any here with the right type;
    public async fetchServiceById(id: number): Promise<any> {
        const query = `
    {
      service(id: "${id}") {
        ${serviceQueryFields}
        description {
          ${serviceDescriptionQueryFields}
        }
      }
    }
    `;
        return this.graphQlClient.getFromSubgraph(query);
    }
}