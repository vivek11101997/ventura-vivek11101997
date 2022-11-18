import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
};

const slice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    TOGGLE_MODAL: (state, action) => {
      state.showModal = !state.showModal;
    },
  },
});
export const { TOGGLE_MODAL } = slice.actions;
export default slice.reducer;
