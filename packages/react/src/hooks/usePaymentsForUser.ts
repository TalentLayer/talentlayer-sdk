import { useEffect, useState } from 'react';
import { IPayment } from '../types';
import useTalentLayer from './useTalentLayer';

export default function usePaymentsForUser(options: {
  id: string;
  numberPerPage: number;
  startDate?: string;
  endDate?: string;
}) {
  const { id, numberPerPage } = options;
  const startDate = options.startDate;
  const endDate = options.endDate;

  const [payments, setPayments] = useState<IPayment[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [offset, setOffset] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const talentLayer = useTalentLayer();

  const total = offset * numberPerPage;

  const start = startDate ? new Date(startDate).getTime() / 1000 : '';
  const end = endDate ? new Date(endDate).getTime() / 1000 : '';

  async function loadData() {
    if (!talentLayer.client) return;

    setLoading(true);
    try {
      const response = await talentLayer.client?.profile.getPayments(
        options.id,
        options.numberPerPage,
        offset,
        options.startDate,
        options.endDate,
      );

      if (response) {
        setPayments([...response]);

        if (response.length < total) {
          setHasMoreData(false);
        }
      }
    } catch (error: any) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [total, id, start, end]);

  useEffect(() => {
    if (!!start && !!end) {
      setOffset(1);
      setHasMoreData(true);
    }
  }, [start, end]);

  function loadMore() {
    setOffset(offset + 1);
  }

  return [{ items: payments, hasMoreData, loadMore } as const, loading, error] as const;
}
