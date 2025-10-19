import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import { userApiSlice } from "./api/userApiSlice";
import { incidentApiSlice } from "./api/incidentApiSlice";
import authReducer from "./features/authSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    auth: authReducer,
    [incidentApiSlice.reducerPath]: incidentApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(userApiSlice.middleware)
      .concat(incidentApiSlice.middleware),
  devTools: import.meta.env.MODE !== "development",
});

setupListeners(store.dispatch);

export default store;
