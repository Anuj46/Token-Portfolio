import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "./slices/watchlistSlice";

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
  },
});
