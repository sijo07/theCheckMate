import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer, { logout } from "./features/authSlice";

// Middleware to handle 401 errors globally
const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (action?.payload?.status === 401) {
    api.dispatch(logout());
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(rtkQueryErrorLogger),
  devTools: import.meta.env.MODE !== "development",
});

setupListeners(store.dispatch);

export default store;
