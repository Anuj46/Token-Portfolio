import { createSlice } from "@reduxjs/toolkit";

const savedWatchList = localStorage.getItem("watchList");
const initialState = savedWatchList ? JSON.parse(savedWatchList) : [];

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    setWatchList: (state, action) => {
      localStorage.setItem("watchList", JSON.stringify(action.payload));
      state = action.payload;
      return action.payload;
    },
    updateHoldings: (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state[index].holdings = action.payload.holdings;
      }
      localStorage.setItem("watchList", JSON.stringify(state));
    },
    removeFromWatchList: (state, action) => {
      const newState = state.filter((item) => item.id !== action.payload);
      localStorage.setItem("watchList", JSON.stringify(newState));
      return newState;
    },
    addToWatchList: (state, action) => {
      state.push(action.payload);
      localStorage.setItem("watchList", JSON.stringify(state));
    },
    clearWatchList: () => {
      localStorage.removeItem("watchList");
      return [];
    },
  },
});

export const {
  setWatchList,
  updateHoldings,
  removeFromWatchList,
  addToWatchList,
  clearWatchList,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;
