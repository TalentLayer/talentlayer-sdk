import React from "react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { IAccount, ICompletionScores, IUser } from "../types";
import { getPlatform } from "../temp";
import { getCompletionScores } from "../utils/profile";
import { TalentLayerClient } from "../../../client/src/index";
import { TalentLayerClientConfig } from "../../../client/src/types";

interface TalentLayerProviderProps {
  children: ReactNode;
  config: TalentLayerClientConfig & {
    platformId: string;
    isActiveDelegate?: boolean;
    delegateAddress?: string;
  };
}

const TalentLayerContext = createContext<{
  user?: IUser;
  account?: IAccount;
  isActiveDelegate: boolean;
  refreshData: () => Promise<boolean>;
  loading: boolean;
  completionScores?: ICompletionScores;
}>({
  user: undefined,
  account: undefined,
  isActiveDelegate: false,
  refreshData: async () => {
    return false;
  },
  loading: true,
  completionScores: undefined,
});

export function TalentLayerProvider(props: TalentLayerProviderProps) {
  const { children, config } = props;

  const account = useAccount();

  const [user, setUser] = useState<IUser | undefined>();
  const [isActiveDelegate, setIsActiveDelegate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completionScores, setCompletionScores] = useState<ICompletionScores>();

  const tlClient = new TalentLayerClient(config);

  // TODO - automatically switch to the default chain is the current one is not part of the config

  async function fetchData() {
    if (!account.address || !account.isConnected) {
      setLoading(false);
      return false;
    }

    try {
      const userResponse = await tlClient.profile.getByAddress(account.address);

      if (userResponse?.data?.data?.users?.length == 0) {
        setLoading(false);
        return false;
      }

      const currentUser = userResponse.data.data.users[0];

      const platformResponse = await getPlatform(tlClient, config.platformId);

      const platform = platformResponse?.data?.data?.platform;
      currentUser.isAdmin = platform?.address === currentUser?.address;

      setUser(currentUser);
      setIsActiveDelegate(
        config.isActiveDelegate &&
          config.delegateAddress &&
          userResponse.data.data.users[0].delegates &&
          userResponse.data.data.users[0].delegates.indexOf(
            config.delegateAddress.toLowerCase()
          ) !== -1
      );

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
    fetchData();
  }, [account.address]);

  useEffect(() => {
    if (!user) return;
    const completionScores = getCompletionScores(user);
    setCompletionScores(completionScores);
  }, [user]);

  const value = useMemo(() => {
    return {
      user,
      account: account ? account : undefined,
      isActiveDelegate,
      refreshData: fetchData,
      loading,
      completionScores,
    };
  }, [account.address, user?.id, isActiveDelegate, loading, completionScores]);

  return (
    <TalentLayerContext.Provider value={value}>
      {children}
    </TalentLayerContext.Provider>
  );
}

export default TalentLayerContext;
