import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import { userApiSlice } from "./api/userApiSlice";
import { incidentApiSlice } from "./api/incidentApiSlice";
import { notificationApiSlice } from "./api/notificationApiSlice";
import { reportApiSlice } from "./api/reportApiSlice";
import { solutionApiSlice } from "./api/solutionApiSlice";
import { issueApiSlice } from "./api/issueApiSlice";
import { serviceApiSlice } from "./api/serviceApiSlice";
import authReducer from "./features/authSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    auth: authReducer,
    [incidentApiSlice.reducerPath]: incidentApiSlice.reducer,
    [notificationApiSlice.reducerPath]: notificationApiSlice.reducer,
    [reportApiSlice.reducerPath]: reportApiSlice.reducer,
    [solutionApiSlice.reducerPath]: solutionApiSlice.reducer,
    [issueApiSlice.reducerPath]: issueApiSlice.reducer,
    [serviceApiSlice.reducerPath]: serviceApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(userApiSlice.middleware)
      .concat(incidentApiSlice.middleware)
      .concat(notificationApiSlice.middleware)
      .concat(reportApiSlice.middleware)
      .concat(solutionApiSlice.middleware)
      .concat(issueApiSlice.middleware)
      .concat(serviceApiSlice.middleware),
  devTools: import.meta.env.MODE !== "development",
});

setupListeners(store.dispatch);

export default store;
