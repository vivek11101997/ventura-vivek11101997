import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  location: null,
  coords: {},
};

const user_slice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    SAVE_USER: (state, action) => {
      let newUser = Object.assign({}, action.payload); // creating copy of state variable jasper
      // update the name property, assign a new value
      return { ...state, user: newUser };
    },

    REMOVE_USER: (state, action) => {
      let newUser = Object.assign({}); // creating copy of state variable jasper
      // update the name property, assign a new value
      return { ...state, user: newUser };
    },

    SET_DELIVERY_LOCATION: (state, action) => {
      return { ...state, location: action.payload };
    },

    SET_USER_GEO_COORDS: (state, action) => {
      return { ...state, coords: action.payload };
    },
  },
});

export const {
  SAVE_USER,
  REMOVE_USER,
  SET_DELIVERY_LOCATION,
  SET_USER_GEO_COORDS,
} = user_slice.actions;
export default user_slice.reducer;
