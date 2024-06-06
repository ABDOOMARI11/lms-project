import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  setOpen: any;
  setPaymentMethod: any;
  data: any;
  user: any;
  refetch: any;
};

const CheckOutForm = ({ data, user, refetch, setPaymentMethod }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<any>("");
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);
      createOrder({ courseId: data._id, payment_info: paymentIntent });
    }
  };

  useEffect(() => {
    if (orderData) {
      refetch();
      socketId.emit("notification", {
        title: "New Order",
        message: `You have a new order from ${data.name}`,
        userId: user._id,
      });
      redirect(`/course-access/${data._id}`);
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [orderData, error]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#000000',
      colorBackground: '#ffffff',
      colorText: '#000000',
      colorDanger: '#df1b41',
      colorTextSecondary: '#ffffff',  // White text for labels
      colorTextPlaceholder: '#ffffff',  // White placeholder text
    },
    rules: {
      '.Input, .Label': {
        color: '#ffffff',  // White text for inputs and labels
      },
    },
  };

  const options = {
    clientSecret: '{{CLIENT_SECRET}}',
    appearance,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="dark:text-white">
        <LinkAuthenticationElement id="link-authentication-element" options={options} />
      </div>
      <div className="dark:text-white">
        <PaymentElement id="payment-element" options={options} />
      </div>
      <div className="flex justify-between mt-2">
        <button
          type="button"
          onClick={() => setPaymentMethod(null)}
          className={`${styles.button} !h-[35px] bg-orange-500 mr-5`}
        >
          Go Back
        </button>
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text" className={`${styles.button} !h-[35px] w-[100px]`}>
            {isLoading ? "Paying..." : "Pay now"}
          </span>
        </button>
      </div>
      {message && (
        <div id="payment-message" className="text-slate-800 font-Poppins pt-2">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckOutForm;
