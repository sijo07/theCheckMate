import ReactDOM from "react-dom/client";
import { Suspense, lazy } from "react";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
} from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./pages/admin/adminRoute";

// Lazy-loaded components
const Login = lazy(() => import("./pages/auth/login.jsx"));
const Register = lazy(() => import("./pages/auth/register.jsx"));
const Home = lazy(() => import("./pages/home.jsx"));
const Contact = lazy(() => import("./pages/contact"));
const Profile = lazy(() => import("./pages/user/profile"));
const ChangePassword = lazy(() => import("./pages/user/changePass.jsx"));
const Map = lazy(() => import("./pages/map"));
const MalwareDetail = lazy(() => import("./components/home/malwareDetail"));
const FeatureDetails = lazy(() => import("./components/home/featureDetails"));
const NotFound = lazy(() => import("./pages/notFound"));
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const ThreatIntelligence = lazy(() => import("./pages/ThreatIntelligence"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));
const Reports = lazy(() => import("./pages/Reports"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Issues = lazy(() => import("./pages/Issues"));
const Services = lazy(() => import("./pages/Services"));


import ErrorBoundary from "./components/ErrorBoundary";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorBoundary />}>
      <Route
        index
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="login"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="register"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Register />
          </Suspense>
        }
      />
      <Route
        path="contact"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Contact />
          </Suspense>
        }
      />
      <Route
        path="map"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Map />
          </Suspense>
        }
      />
      <Route
        path="malwareDetail/:malwareType"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <MalwareDetail />
          </Suspense>
        }
      />
      <Route
        path="feature/:featureType"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <FeatureDetails />
          </Suspense>
        }
      />

      {/* New Feature Pages */}
      <Route
        path="threat-intelligence"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <ThreatIntelligence />
          </Suspense>
        }
      />
      <Route
        path="notifications"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Notifications />
          </Suspense>
        }
      />
      <Route
        path="settings"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Settings />
          </Suspense>
        }
      />
      <Route
        path="reports"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Reports />
          </Suspense>
        }
      />
      <Route
        path="solutions"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Solutions />
          </Suspense>
        }
      />
      <Route
        path="issues"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Issues />
          </Suspense>
        }
      />
      <Route
        path="services"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Services />
          </Suspense>
        }
      />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route
          path="profile"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="changePassword"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ChangePassword />
            </Suspense>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <NotFound />
          </Suspense>
        }
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
