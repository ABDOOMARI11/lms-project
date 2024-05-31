import React, { useEffect, useRef } from 'react';
import { PayPalOrderData, PayPalActions } from './paypalTypes'; // Assurez-vous de mettre le bon chemin d'importation

interface PayPalButtonProps {
  amount: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, onError }) => {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Chargez le script PayPal de manière dynamique
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AUOFFsj8SWplClKMn-D8GgQ9y9QorvCN8LxBVr1VF_NKAN1R_QqnPBBIUFpoWS6EQVmDu_PDfdEwiLNu`;
    script.async = true;
    script.onload = () => {
      if (paypalRef.current && window.paypal) {
        window.paypal.Buttons({
          createOrder: (data: PayPalOrderData, actions: PayPalActions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                },
              ],
            });
          },
          onApprove: async (data: PayPalOrderData, actions: PayPalActions) => {
            try {
              const order = await actions.order.capture();
              onSuccess(order);
            } catch (error) {
              onError(error);
            }
          },
          onError: (err: any) => {
            onError(err);
          },
        }).render(paypalRef.current);
      }
    };
    document.body.appendChild(script);

    return () => {
      // Nettoyer le script PayPal lors du démontage du composant
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [amount, onSuccess, onError]);

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;
