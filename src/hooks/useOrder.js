import { useState } from 'react';
import { createOrder } from '../services/orderService';
import toast from 'react-hot-toast';

export function useOrder() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const placeOrder = async (data) => {
    setLoading(true);
    try {
      const result = await createOrder(data);
      setSuccess(true);
      setOrderData(result.data);
      toast.success('Commande passée avec succès ! 🎉');
      return result;
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la commande.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setSuccess(false); setOrderData(null); };

  return { placeOrder, loading, success, orderData, reset };
}
