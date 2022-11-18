import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const example_slice = createSlice({
  name: "task",
  initialState: initialState,
  reducers: {
    ACTION_NAME: (state, action) => {
      // logic here
      return {
        ...state,
      };
    },
  },
});

export const { ACTION_NAME } = example_slice.actions;
export default example_slice.reducer;
