import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="scanline-effect" />
      {shouldShowNavbar && <Navbar />}
      <main className="relative z-10">
        <Outlet />
      </main>
    </>
  );
};

export default App;
