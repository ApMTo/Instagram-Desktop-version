import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../API";

const registerUserSlice = createSlice({
    name: 'user',
    initialState: {
        user : {},
        isLoading: false,
        isError: false,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            debugger
            state.isLoading = true;
        } )
        .addCase(registerUser.fulfilled, (state, {payload}) => {
            debugger
            state.isLoading = false;
            state.loggedInUser = payload;
        } )
        .addCase(registerUser.rejected, (state, payload) => {
            debugger
            state.isError = payload.error.message;
            state.isLoading = false;
        } )
    }
})


export const selectRegisterUser = (state) => state.registerUser;
export const { } = registerUserSlice.actions;
export const registerUserReducer = registerUserSlice.reducer;


