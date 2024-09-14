import { createSlice } from "@reduxjs/toolkit";
import { getFetchUserById } from "../API";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user : {},
        isLoading: false,
        isError: false
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getFetchUserById.pending, (state) => {
            state.isLoading = true;
        } )
        .addCase(getFetchUserById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.user = payload;
        } )
        .addCase(getFetchUserById.rejected, (state) => {
            state.isError = true;
            state.isLoading = false;
        } )
    }
})


export const selectUserById = (state) => state.user;
export const { } = userSlice.actions;
export const userReducer = userSlice.reducer;


