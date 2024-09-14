import { createSlice } from "@reduxjs/toolkit";

const commentsSlice = createSlice({
    name: 'comments',
    initialState: [],
    reducers: {

    }
})


export const selectComments = (state) => state.comments;
export const { } = commentsSlice.actions;
export const commentsReducer = commentsSlice.reducer;