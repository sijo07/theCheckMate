import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Loader from "../../components/loader";
import { setCredentials } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "../../redux/api/userApiSlice";
import { FaSun, FaMoon } from "react-icons/fa";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username);
      setPhone(userInfo.phone);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

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

    if (!password || !confirmPassword) {
      toast.error("Please enter password to save");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          phone,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
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
          <span className="uppercase font-bold text-red-400">Profile</span>
        </motion.div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 bg-gray-300 dark:bg-gray-800 rounded-full shadow-lg mr-10"
        >
          {darkMode ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Profile Form Card */}
      <motion.div
        className="w-full max-w-lg bg-gray-200 dark:bg-gray-950 shadow-2xl rounded-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-6">
          <motion.h2
            className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Update Profile
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-400 text-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Edit your details below
          </motion.p>

          <motion.form
            onSubmit={submitHandler}
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.input
              type="text"
              placeholder="Username"
              className="w-full p-3 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <motion.input
              type="tel"
              placeholder="Phone"
              className="w-full p-3 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <motion.input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <motion.input
              type="password"
              placeholder="New Password"
              className="w-full p-3 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <motion.input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-3 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <motion.button
              type="submit"
              className="w-full bg-red-800 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-200"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </motion.button>
            {isLoading && <Loader />}
          </motion.form>
        </div>

        {/* Change Password Section */}
        <motion.div
          className="bg-red-800 text-white py-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm">
            Change Password
            <Link to="/changePassword" className="font-semibold underline">
              &nbsp;Click Here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
