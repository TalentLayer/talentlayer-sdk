'use client';

import React, { ContextType } from 'react';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { IAccount, IUser, NetworkEnum } from '../types';
import { TalentLayerClient } from '@talentlayer/client';

interface TalentLayerProviderProps {
  children: ReactNode;
  config: ConstructorParameters<typeof TalentLayerClient>[0] & {
    account: ReturnType<typeof useAccount>;
  };
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

  const account = config.account;

  const [user, setUser] = useState<IUser | undefined>();
  const [loading, setLoading] = useState(true);

  const [talentLayerClient, setTalentLayerClient] = useState<TalentLayerClient>();

  async function loadData() {
    if (!talentLayerClient) return false;

    if (!account.address || !account.isConnected) {
      setLoading(false);
      return false;
    }

    try {
      const userResponse = await talentLayerClient.profile.getByAddress(account.address);

      const currentUser = userResponse;

      const platformResponse = await talentLayerClient.platform.getOne(
        config.platformId.toString(),
      );

      const platform = platformResponse;
      currentUser.isAdmin = platform?.address === currentUser?.address;

      setUser(currentUser);

      return true;
    } catch (err: any) {
      console.error(err);

      return false;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (chainId && account.address) {
      const tlClient = new TalentLayerClient(config);
      setTalentLayerClient(tlClient);
    }
  }, [chainId, account.address]);

  useEffect(() => {
    if (!talentLayerClient) return;

    loadData();
  }, [talentLayerClient]);

  const value = useMemo<ContextType<typeof TalentLayerContext>>(() => {
    return {
      user,
      account: account ? account : undefined,
      refreshData: loadData,
      loading,
      client: talentLayerClient,
      chainId,
      platformId,
      subgraph: {
        query: (query: string) => (talentLayerClient as TalentLayerClient).graphQlClient.get(query),
      },
    } as any;
  }, [account.address, user?.id, loading]);

  return <TalentLayerContext.Provider value={value}>{children}</TalentLayerContext.Provider>;
}

export default TalentLayerContext;
