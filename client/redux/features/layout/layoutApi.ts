import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroData: builder.query({
      query: (type) => ({
        url: `get-layout`,
        params: { type },
        method: "GET",
        credentials: "include",
      }),
    }),
    editLayout: builder.mutation({
      query: ({ type, image, title, subTitle, FAQ, categories }) => ({
        url: `edit-layout`,
        body: {
          type,
          image,
          title,
          subTitle,
          FAQ,
          categories,
        },
        method: "PUT",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetHeroDataQuery, useEditLayoutMutation } = layoutApi;
