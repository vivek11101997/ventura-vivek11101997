import { combineReducers } from "redux";
import LandingReducer from "./Landing";
import modalReducer from "./modal";

const rootReducer = combineReducers({
  modalReducer: modalReducer,
  LandingReducer: LandingReducer,
});

export default rootReducer;
