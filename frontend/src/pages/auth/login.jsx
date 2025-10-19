import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../../components/loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-3 rounded-full bg-gray-300 dark:bg-gray-800 shadow-lg hover:shadow-xl transition duration-300"
      >
        {darkMode ? (
          <FaSun className="text-yellow-400 text-xl animate-spin-slow" />
        ) : (
          <FaMoon className="text-gray-600 text-xl" />
        )}
      </button>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full bg-gray-200 dark:bg-gray-950 text-black dark:text-white shadow-xl">
          <CardContent className="p-6">
            <motion.h2
              className="mb-4 text-3xl font-bold text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome Back
            </motion.h2>
            <motion.p
              className="mb-6 text-center text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Sign in to your account
            </motion.p>

            <motion.form
              onSubmit={submitHandler}
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Input
                type="email"
                placeholder="Email"
                className="bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                className="bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" /> Remember me
                </label>
                <Link to="/forgot-password" className="hover:underline">
                  Forgot password?
                </Link>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-red-700 dark:bg-red-500 hover:bg-red-600 py-3 rounded-lg font-semibold text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </motion.button>
              {isLoading && <Loader />}
            </motion.form>

            <motion.div
              className="flex justify-center mt-4 space-x-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a
                href="#"
                className="p-3 bg-gray-700 dark:bg-gray-800 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="p-3 bg-gray-700 dark:bg-gray-800 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700"
              >
                <FaGoogle />
              </a>
              <a
                href="#"
                className="p-3 bg-gray-700 dark:bg-gray-800 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700"
              >
                <FaTwitter />
              </a>
            </motion.div>

            <motion.p
              className="mt-4 text-center text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Don't have an account?
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-teal-500 hover:underline"
              >
                &nbsp;Register
              </Link>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
