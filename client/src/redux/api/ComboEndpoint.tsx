import BaseApi from "./BaseApi";

const ComboEndpoint = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        CreateCombo: builder.mutation({
            query: (arg) => ({
                url: "/combo/create-new-combo",
                body: arg,
                method: "POST"
            }),
            invalidatesTags: ["combo"]
        }),
        DeleteCombo: builder.mutation({
            query: (arg) => ({
                url: "/combo/delete-combo",
                body: arg,
                method: "Delete"
            }),
            invalidatesTags: ["combo"]
        }),
        DeleteComboTracking: builder.mutation({
            query: (arg) => ({
                url: "/combo/delete-combo-track",
                body: arg,
                method: "Delete"
            }),
            invalidatesTags: ["combo"]
        }),
        MatchCombo: builder.mutation({
            query: (arg) => ({
                url: "/combo/match-combo",
                body: arg,
                method: "POST"
            }),
            invalidatesTags: ["combo", "User", "setting", "task"]
        }),
        AllComboListForAdmin: builder.query({
            query: () => ({
                url: "/combo/all-combo",
                method: "GET"
            }),
            providesTags: ["combo"]
        }),
        AllComboListForUser: builder.query({
            query: () => ({
                url: "/combo/all-combo-user",
                method: "GET"
            }),
            providesTags: ["combo"]
        }),
    })
});

export const {useDeleteComboTrackingMutation, useDeleteComboMutation, useMatchComboMutation, useCreateComboMutation, useAllComboListForAdminQuery, useAllComboListForUserQuery } = ComboEndpoint;