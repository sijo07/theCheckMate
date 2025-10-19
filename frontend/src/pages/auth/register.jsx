import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setCredentials } from "../../redux/features/authSlice";
import { useRegisterMutation } from "../../redux/api/userApiSlice";
import Loader from "../../components/loader";
import { toast } from "react-toastify";
import { BsMoon, BsSun } from "react-icons/bs";

const Register = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const newUser = { username, phone, email, password };
        const res = await register(newUser).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (error) {
        console.error("Error registering user:", error);
        toast.error(error.data?.message || error.message);
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition duration-300">
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-2 bg-gray-300 dark:bg-gray-800 rounded-full shadow-md transition duration-300"
      >
        {darkMode ? (
          <BsSun className="text-yellow-400" />
        ) : (
          <BsMoon className="text-gray-900" />
        )}
      </button>

      <motion.div
        className="w-full max-w-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200 shadow-2xl rounded-lg overflow-hidden transition duration-300"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-6">
          <motion.h2
            className="text-3xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Create an Account
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-400 text-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Enter your details to register
          </motion.p>

          <motion.form
            onSubmit={submitHandler}
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[
              { placeholder: "Username", value: username, setter: setUsername },
              { placeholder: "Phone", value: phone, setter: setPhone },
              { placeholder: "Email", value: email, setter: setEmail },
              { placeholder: "Password", value: password, setter: setPassword },
              {
                placeholder: "Confirm Password",
                value: confirmPassword,
                setter: setConfirmPassword,
              },
            ].map((field, index) => (
              <motion.input
                key={index}
                type={
                  field.placeholder.includes("Password")
                    ? "password"
                    : field.placeholder === "Email"
                    ? "email"
                    : "text"
                }
                placeholder={field.placeholder}
                className="w-full p-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                required
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                whileFocus={{ scale: 1.05 }}
              />
            ))}
            <motion.button
              type="submit"
              className="w-full bg-red-500 dark:bg-red-800 text-white py-3 rounded-lg font-semibold hover:bg-red-600 dark:hover:bg-red-700 transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? "Registering..." : "Sign Up"}
            </motion.button>
            {isLoading && <Loader />}
          </motion.form>
        </div>
        <motion.div
          className="bg-red-500 dark:bg-red-800 text-white py-6 text-center transition duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="font-semibold underline"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
