import { useEffect, useState } from 'react';
import { IPayment, PaymentTypeEnum } from '../types';
import queries from '../queries';
import useTalentLayer from './useTalentLayer';

export default function usePaymentsByService(id: string, paymentType?: PaymentTypeEnum) {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  const talentLayer = useTalentLayer();

  async function loadData() {
    try {
      const query = queries.payments.getPaymentsByService(id, paymentType);
      const response = await talentLayer.subgraph.query(query);

      if (response?.data?.data?.payments) {
        setPayments(response.data.data.payments);
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
  }, [id]);

  return [payments, loading, error] as const;
}
