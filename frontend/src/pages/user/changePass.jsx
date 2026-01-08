import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "../../redux/api/userApiSlice";
import { logout, setCredentials } from "../../redux/features/authSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const { userInfo } = useSelector((state) => state.auth);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

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

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Password updated successfully");

      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 text-black dark:text-white">
      <div className="w-full max-w-5xl flex justify-between items-center mb-5">
        <motion.div className="text-sm pb-6 w-full max-w-5xl">
          <Link
            to="/"
            className="hover:underline uppercase hover:font-semibold"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            to="/profile"
            className="hover:underline uppercase hover:font-semibold"
          >
            Profile
          </Link>
          <span className="mx-2">/</span>
          <span className="uppercase font-bold text-red-400">
            Change Password
          </span>
        </motion.div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 bg-gray-300 dark:bg-gray-800 rounded-full shadow-lg mr-15"
        >
          {darkMode ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Password Change Form */}
      <motion.div
        className="w-full max-w-lg bg-gray-200 dark:bg-gray-950 shadow-2xl rounded-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-6">
          <motion.h2
            className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Change Password
          </motion.h2>

          <motion.p
            className="text-gray-600 dark:text-gray-400 text-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Enter your current and new password
          </motion.p>

          <motion.form
            onSubmit={submitHandler}
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <input
              type="password"
              placeholder="Current Password"
              className="w-full p-3 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-3 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <motion.button
              type="submit"
              className="w-full bg-red-800 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? "Updating..." : "Change Password"}
            </motion.button>
            {isLoading && <Loader />}
          </motion.form>
        </div>

        <motion.div
          className="bg-red-800 text-white py-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm">
            Remembered your password?{" "}
            <span
              onClick={() => navigate("/profile")}
              className="font-semibold underline cursor-pointer"
            >
              Go to Profile
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
