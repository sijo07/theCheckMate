import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <ToastContainer theme="dark" />
      <div className="scanline-effect" />
      {shouldShowNavbar && <Navbar />}
      <main className="relative z-10">
        <Outlet />
      </main>
      {shouldShowNavbar && <Footer />}
    </>
  );
};

export default App;
