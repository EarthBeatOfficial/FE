import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "@/constants/interfaces";

interface SessionState {
  activeSession: Session | null;
}

const initialState: SessionState = {
  activeSession: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setActiveSession: (state, action: PayloadAction<Session | null>) => {
      state.activeSession = action.payload;
    },
    clearActiveSession: (state) => {
      state.activeSession = null;
    },
  },
});

export const { setActiveSession, clearActiveSession } = sessionSlice.actions;
export default sessionSlice.reducer;
