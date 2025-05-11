import { combineReducers } from "@reduxjs/toolkit";
import routeReducer from "./slices/routeSlices";
import userReducer from "./slices/userSlices";

const rootReducer = combineReducers({
  user: userReducer,
  route: routeReducer,
});

export default rootReducer;
