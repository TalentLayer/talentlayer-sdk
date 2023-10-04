import React, { ContextType } from 'react';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { IAccount, IUser, NetworkEnum } from '../types';
import { TalentLayerClient } from '@talentlayer/client';

type TalentLayerConfig = {
  chainId: NetworkEnum;
  platformId: number;
  infuraClientId: string;
  infuraClientSecret: string;
};

interface TalentLayerProviderProps {
  children: ReactNode;
  config: TalentLayerConfig;
}

export interface Subgraph {
  query: (query: string) => any;
}

const TalentLayerContext = createContext<{
  user?: IUser;
  account?: IAccount;
  refreshData: () => Promise<boolean>;
  loading: boolean;
  client: TalentLayerClient | undefined;
  platformId: number;
  chainId?: NetworkEnum;
  subgraph: Subgraph;
}>({
  user: undefined,
  account: undefined,
  refreshData: async () => {
    return false;
  },
  loading: true,
  client: {} as TalentLayerClient,
  platformId: -1,
  chainId: undefined,
  subgraph: { query: _ => new Promise(resolve => resolve(null)) },
});

export function TalentLayerProvider(props: TalentLayerProviderProps) {
  const { children, config } = props;
  const { chainId, platformId } = config;

  const account = useAccount();

  const [user, setUser] = useState<IUser | undefined>();
  const [loading, setLoading] = useState(true);

  let talentLayerClient = new TalentLayerClient(config);

  async function loadData() {
    if (!talentLayerClient) return false;

    if (!account.address || !account.isConnected) {
      setLoading(false);
      return false;
    }

    try {
      const userResponse = await talentLayerClient.profile.getByAddress(account.address);

      if (userResponse) {
        setLoading(false);
        return false;
      }

      const currentUser = userResponse;

      const platformResponse = await talentLayerClient.platform.getOne(
        config.platformId.toString(),
      );

      const platform = platformResponse;
      currentUser.isAdmin = platform?.address === currentUser?.address;

      setUser(currentUser);

      setLoading(false);
      return true;
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      //TODO - Handle error for the developer in a visual manner
      return false;
    }
  }

  useEffect(() => {
    if (!talentLayerClient) return;

    loadData();
  }, [account.address]);

  const value = useMemo<ContextType<typeof TalentLayerContext>>(() => {
    return {
      user,
      account: account ? account : undefined,
      refreshData: loadData,
      loading,
      client: talentLayerClient,
      chainId,
      platformId,
      subgraph: { query: (query: string) => talentLayerClient.graphQlClient.get(query) },
    };
  }, [account.address, user?.id, loading]);

  return <TalentLayerContext.Provider value={value}>{children}</TalentLayerContext.Provider>;
}

export default TalentLayerContext;
