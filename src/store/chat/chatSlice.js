import { createSlice } from "@reduxjs/toolkit";
import { getFetchChats } from "../slices/API";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatsData: []
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getFetchChats.pending, (state) => {
            console.log('pending');
        } )
        .addCase(getFetchChats.fulfilled, (state, {payload}) => {
            state.chatsData = payload;
        })
        .addCase(getFetchChats.rejected, (state) => {
            console.log('error');
        } )
     
    }
})


export const selectChat = (state) => state.chat;
export const { } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;