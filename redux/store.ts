import { configureStore } from "@reduxjs/toolkit";
import routeReducer from "./slices/routeSlice";
import walkReducer from "./slices/walkSlice";
import sessionReducer from "./slices/sessionSlice";

export const store = configureStore({
  reducer: {
    route: routeReducer,
    walk: walkReducer,
    session: sessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
