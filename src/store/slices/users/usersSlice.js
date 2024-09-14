import { createSlice } from "@reduxjs/toolkit";
import { getFetchUsers } from "../API";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    isLoading: false,
    isError: false,
    currentUser: {},
  },
  reducers: {
    setCurrentUser(state, { payload }) {
      state.currentUser = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFetchUsers.pending, (state) => {
        console.log("pending");
      })
      .addCase(getFetchUsers.fulfilled, (state, { payload }) => {
        state.data = payload;
      })
      .addCase(getFetchUsers.rejected, (state) => {
        console.log("error");
      });
  },
});

export const selectUsers = (state) => state.users;
export const {setCurrentUser} = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
