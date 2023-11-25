import { useEffect, useState } from 'react';
import { IService, ServiceStatusEnum } from '../types';
import useTalentLayer from './useTalentLayer';

export default function useServices(filters: {
  serviceStatus?: ServiceStatusEnum;
  buyerId?: string;
  sellerId?: string;
  searchQuery?: string;
  numberPerPage?: number;
  platformId?: string;
}) {
  const [services, setServices] = useState<IService[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  async function loadData() {
    if (!talentLayer.client) return;

    try {
      setLoading(true);
      let response;
      let newServices: IService[] = [];

      response = await talentLayer.client.service.getServices({
        offset,
        ...filters,
        platformId: filters.platformId || talentLayer.platformId.toString(),
      });

      if (filters.searchQuery) {
        newServices = response.data;
      } else {
        newServices = response.data.services;
      }

      setServices(offset === 0 ? newServices || [] : [...services, ...newServices]);

      if (filters.numberPerPage && newServices.length < filters.numberPerPage) {
        setCanLoadMore(false);
      } else {
        setCanLoadMore(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setServices([]);
    setOffset(0);
  }, [filters.searchQuery]);

  useEffect(() => {
    loadData();
  }, [filters.numberPerPage, offset, filters.searchQuery, filters.buyerId, filters.serviceStatus]);

  function loadMore() {
    filters.numberPerPage ? setOffset(offset + filters.numberPerPage) : '';
  }

  return [{ canLoadMore, items: services, loadMore } as const, loading, error] as const;
}
