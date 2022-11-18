import logger from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  middleware: [thunk, logger],
  reducer: rootReducer,
});

export default store;
