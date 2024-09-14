import { createSlice } from "@reduxjs/toolkit";
import { getFetchSessions } from "./API";

const sessionsSlice = createSlice({
  name: "sessions",
  initialState: {
    sessionsData: [],
    isSessionsLoading: true,
    isSessionsError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFetchSessions.pending, (state) => {
        state.isSessionsLoading = true;
      })
      .addCase(getFetchSessions.fulfilled, (state, { payload }) => {
        state.isSessionsLoading = false;
        state.sessionsData = payload;
      })
      .addCase(getFetchSessions.rejected, (state) => {
        state.isSessionsError = true;
        state.isSessionsLoading = false;
      });
  },
});

export const selectSessions = (state) => state.sessions;
export const {} = sessionsSlice.actions;
export const sessionsReducer = sessionsSlice.reducer;
