import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalkState {
  status: "IDLE" | "IN_PROGRESS" | "COMPLETED";
}

const initialState: WalkState = {
  status: "IDLE",
};

const walkSlice = createSlice({
  name: "walk",
  initialState,
  reducers: {
    setWalkStatus: (state, action: PayloadAction<WalkState["status"]>) => {
      state.status = action.payload;
    },
    resetWalkStatus: (state) => {
      state.status = "IDLE";
    },
  },
});

export const { setWalkStatus, resetWalkStatus } = walkSlice.actions;
export default walkSlice.reducer;
