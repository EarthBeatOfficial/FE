import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RouteState {
  recommendedRoute: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    waypoints: Array<{ location: { lat: number; lng: number } }>;
  } | null;
}

const initialState: RouteState = {
  recommendedRoute: null,
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRecommendedRoute: (state, action: PayloadAction<RouteState['recommendedRoute']>) => {
      state.recommendedRoute = action.payload;
    },
  },
});

export const { setRecommendedRoute } = routeSlice.actions;
export default routeSlice.reducer; 