import { createSlice } from "@reduxjs/toolkit";
import { addSession, getFetchSessions } from "./API";

const addSessionSlice = createSlice({
    name: 'session',
    initialState: {
        session : [],
        isAddSessionLoading: false,
        isAddSessionError: false
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(addSession.pending, (state) => {
            state.isAddSessionLoading = true;
        } )
        .addCase(addSession.fulfilled, (state, {payload}) => {
            state.isAddSessionLoading = false;
            state.session = payload;
        } )
        .addCase(addSession.rejected, (state) => {
            state.isAddSessionLoading = false;
            state.isAddSessionError = true;
        } )
    }
})

export const selectAddSession = (state) => state.session;
export const { } = addSessionSlice.actions;
export const addSessionReducer = addSessionSlice.reducer;


