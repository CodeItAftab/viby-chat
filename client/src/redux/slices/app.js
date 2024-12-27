import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoader(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.isError = action.payload.isError;
      state.errorMessage = action.payload.errorMessage;
    },
  },
});

export const { setLoader, setError } = slice.actions;

export default slice.reducer;
