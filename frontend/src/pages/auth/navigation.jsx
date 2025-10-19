import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/authSlice";
import { Button } from "@/components/ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [pageScroll, setPageScroll] = useState(false);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setPageScroll(window.scrollY >= 90);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full fixed top-0 left-0 z-10 transition duration-300 ${
          pageScroll ? "shadow-lg bg-[rgba(0,0,0,0.6)]" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center max-w-screen-xl mx-auto p-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-bold text-white capitalize">
              Real Time Cyber Threat Intelligence
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <div
                className="relative cursor-pointer"
                ref={dropdownRef}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <span className="text-sm font-semibold text-gray-200">
                  Hi, {userInfo.username}
                </span>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-10 w-56 bg-white shadow-lg rounded-lg p-3"
                    >
                      <p className="px-4 py-3 font-semibold text-sm text-gray-700">
                        Hello, {userInfo.username}
                      </p>
                      <hr />
                      {userInfo.isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-3 text-sm text-gray-600 hover:text-black"
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-sm text-gray-600 hover:text-black"
                      >
                        Edit Profile
                      </Link>
                      <Link
                        to="/contact"
                        className="block px-4 py-3 text-sm text-gray-600 hover:text-black"
                      >
                        Contact Us
                      </Link>
                      <button
                        onClick={logoutHandler}
                        className="block px-4 py-3 text-sm text-red-500 hover:text-red-700 w-full text-left"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-red-800 hover:bg-red-700 text-xs font-semibold text-gray-200 rounded-full">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden px-4 py-2 text-white rounded-xl"
            onClick={() => setShowSidebar(true)}
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black bg-opacity-75"
          >
            <div className="absolute top-0 right-0 w-64 h-full bg-gray-950 shadow-lg p-6">
              <button
                className="mb-6 px-4 py-2 text-white bg-red-900 rounded-xl"
                onClick={() => setShowSidebar(false)}
              >
                <IoClose />
              </button>
              <ul className="space-y-4">
                {userInfo ? (
                  <>
                    {userInfo.isAdmin && (
                      <li>
                        <Link
                          to="/admin/dashboard"
                          className="block text-gray-100 hover:text-black"
                          onClick={() => setShowSidebar(false)}
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        to="/profile"
                        className="block text-gray-100 hover:text-black"
                        onClick={() => setShowSidebar(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setShowSidebar(false);
                          logoutHandler();
                        }}
                        className="block text-gray-100 hover:text-black"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="block text-gray-100 hover:text-black"
                      onClick={() => setShowSidebar(false)}
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
