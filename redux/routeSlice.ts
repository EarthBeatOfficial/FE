import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RouteState {
  recommendedRoute: any | null;
}

const initialState: RouteState = {
  recommendedRoute: null,
};

export const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
    setRecommendedRoute: (state, action: PayloadAction<any>) => {
      state.recommendedRoute = action.payload;
    },
    clearRoute: (state) => {
      state.recommendedRoute = null;
    },
  },
});

export const { setRecommendedRoute, clearRoute } = routeSlice.actions;
export default routeSlice.reducer;
