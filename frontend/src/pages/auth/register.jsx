import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setCredentials } from "../../redux/features/authSlice";
import { useRegisterMutation } from "../../redux/api/userApiSlice";
import Loader from "../../components/loader";
import { toast } from "react-toastify";

const Register = () => {
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
    <div className="flex items-center justify-center min-h-screen bg-[#09090b] text-white px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        className="w-full max-w-lg relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="card-glass border border-white/05 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

          <motion.h2
            className="text-4xl font-black text-center mb-2 uppercase tracking-tighter"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            New <span className="text-red-500">Asset</span> Registration
          </motion.h2>
          <motion.p
            className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            CREATE YOUR SECURITY IDENTITY // DELTA-6
          </motion.p>

          <motion.form
            onSubmit={submitHandler}
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[
              { placeholder: "USERNAME", value: username, setter: setUsername },
              { placeholder: "PHONE", value: phone, setter: setPhone },
              { placeholder: "EMAIL", value: email, setter: setEmail },
              { placeholder: "SECURITY KEY", value: password, setter: setPassword },
              {
                placeholder: "CONFIRM SECURITY KEY",
                value: confirmPassword,
                setter: setConfirmPassword,
              },
            ].map((field, idx) => (
              <motion.input
                key={idx}
                type={
                  field.placeholder.includes("KEY")
                    ? "password"
                    : field.placeholder.includes("EMAIL")
                      ? "email"
                      : "text"
                }
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-white/05 border border-white/10 rounded-lg text-white text-[11px] font-bold uppercase tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-500/30 transition-all"
                required
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                whileFocus={{ scale: 1.01 }}
              />
            ))}
            <motion.button
              type="submit"
              className="w-full bg-red-500 text-white py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.2)] mt-4"
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "INITIALIZING..." : "INITIALIZE ACCOUNT"}
            </motion.button>
            {isLoading && <Loader />}
          </motion.form>

          <motion.div
            className="mt-8 pt-6 border-t border-white/05 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              Existing identity?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-red-500 hover:text-red-400 transition-colors ml-2 font-black"
              >
                Establish Connection
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
