import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (type) => ({
        url: `get-orders`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getStripePublishablekey: builder.query({
      query: () => ({
        url: `payment/stripepublishablekey`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createPaymentIntent: builder.mutation({
      query: (amount) => ({
        url: "payment",
        method: "POST",
        body: {
          amount,
        },
        credentials: "include" as const,
      }),
    }),
    createOrder: builder.mutation({
      query: ({ courseId, payment_info }) => ({
        url: "create-order",
        body: {
          courseId,
          payment_info,
        },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    createManualOrder: builder.mutation({
      query: ({ userId,courseId, payment_info }) => {
        console.log("Request Body:", { userId,courseId, payment_info }); // Log des données envoyées dans la requête
        return ({
          url: "create-manual-order",
          body: {
            userId,
            courseId,
            payment_info,
          },
          method: "POST",
          credentials: "include" as const,
        })
      },
    }),
  }),
});


export const { useGetAllOrdersQuery,useGetStripePublishablekeyQuery, useCreatePaymentIntentMutation ,useCreateOrderMutation,useCreateManualOrderMutation} =
  ordersApi;
