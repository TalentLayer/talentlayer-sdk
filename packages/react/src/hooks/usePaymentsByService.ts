import { useEffect, useState } from 'react';
import { IPayment, PaymentTypeEnum } from '../types';
import useTalentLayer from './useTalentLayer';

export default function usePaymentsByService(id: string, paymentType?: PaymentTypeEnum) {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  const talentLayer = useTalentLayer();

  async function loadData() {
    try {
      const response = await talentLayer.client?.escrow.getByService(id)

      if (response) {
        setPayments(response);
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
