import { createSlice } from "@reduxjs/toolkit";
import { getFetchPosts } from "../API";

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        postsData: []
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getFetchPosts.pending, (state) => {
            console.log('pending');
        } )
        .addCase(getFetchPosts.fulfilled, (state, {payload}) => {
            state.postsData = payload;
        })
        .addCase(getFetchPosts.rejected, (state) => {
            console.log('error');
        } )
    }
})


export const selectPosts = (state) => state.posts;
export const { } = postSlice.actions;
export const postsReducer = postSlice.reducer;