import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../API";
import { getFetchUserById } from "../API";

const loggedInUserSlice = createSlice({
  name: "loggedInUser",
  initialState: {
    loggedInUser: {},
    isLoading: false,
    isError: false,
  },
  reducers: {
    updateUser: (state, { payload }) => {
      state.loggedInUser = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.loggedInUser = payload;
      })
      .addCase(loginUser.rejected, (state, payload) => {
        state.isError = payload.error.message;
        state.isLoading = false;
      })
      .addCase(getFetchUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFetchUserById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.loggedInUser = payload;
      })
      .addCase(getFetchUserById.rejected, (state, payload) => {
        state.isError = payload.error.message;
        state.isLoading = false;
      });
  },
});

export const selectLoggedInUser = (state) => state.loggedInUser;
export const { updateUser } = loggedInUserSlice.actions;
export const loggedInUserReducer = loggedInUserSlice.reducer;
