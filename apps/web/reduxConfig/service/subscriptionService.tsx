import { RootApiService } from "../index"

export const SubscriptionApiSlice = RootApiService.injectEndpoints({
    endpoints: (builder) => ({
        getPlans: builder.query({
            query: () => ({
                url: "plans",
                method: "GET",
            }),
            providesTags: ["Auth"]
        }),
        subscribe: builder.mutation({
            query: (planId: string) => ({
                url: `subscribe?planId=${planId}`,
                method: "GET",
            }),
            invalidatesTags: ["Auth"]
        }),
        verifyPayment: builder.mutation({
            query: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; razorpayResponse?: object }) => ({
                url: "subscribe/verify-payment",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Auth"]
        }),
    })
})

export const { useGetPlansQuery, useSubscribeMutation, useVerifyPaymentMutation } = SubscriptionApiSlice