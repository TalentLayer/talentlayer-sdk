import { useEffect, useState } from 'react';
import useTalentLayer from './useTalentLayer';

const query = `
{
  protocols {
    userMintFee,
    shortHandlesMaxPrice
  }
}
  `;

export default function useMintFee() {
  const [mintFee, setMintFee] = useState(0);
  const [shortHandlesMaxPrice, setShortHandlesMaxPrice] = useState(0);

  const talentLayer = useTalentLayer();

  async function loadData() {
    try {
      const response = await talentLayer.subgraph.query(query);
      const data = response.data;

      if (data) {
        const protocol = data.protocols[0];
        setMintFee(protocol.userMintFee);
        setShortHandlesMaxPrice(protocol.shortHandlesMaxPrice);
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  useEffect(() => {
    loadData();
  }, [talentLayer.chainId]);

  const calculateMintFee = (handle: string) => {
    const length = handle.length;
    const handlePrice = length > 4 ? mintFee : shortHandlesMaxPrice / Math.pow(2, length - 1);
    return handlePrice;
  };

  return { calculateMintFee };
}
