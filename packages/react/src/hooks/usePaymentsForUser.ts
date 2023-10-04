import { useEffect, useState } from 'react';
import { IPayment } from '../types';
import useTalentLayer from './useTalentLayer';
import queries from '../queries';

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
    setLoading(true);
    try {
      const query = queries.payments.getPaymentsForUser(
        id,
        total,
        0,
        start.toString(),
        end.toString(),
      );
      const response = talentLayer.subgraph.query(query);

      if (response && response.data && response.data.data) {
        setPayments([...response.data.data.payments]);

        if (response.data.data.payments.length < total) {
          setHasMoreData(false);
        }
      }
    } catch (error: any) {
      console.error(error);
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
