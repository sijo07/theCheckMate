import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import {
  FaFacebookF,
  FaTwitter,
  FaGoogle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../../components/loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="flex items-center justify-center min-h-screen bg-[#09090b] text-white px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="card-glass border border-white/05 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
          <motion.h2
            className="mb-2 text-4xl font-black text-center uppercase tracking-tighter"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            System <span className="text-red-500">Access</span>
          </motion.h2>
          <motion.p
            className="mb-8 text-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            INITIALIZE SECURE PROTOCOL // DELTA-6
          </motion.p>

          <motion.form
            onSubmit={submitHandler}
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <input
              type="email"
              placeholder="EMAIL IDENTIFIER"
              className="w-full px-4 py-3 bg-white/05 border border-white/10 rounded-lg text-white text-[11px] font-bold uppercase tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-500/30 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="SECURITY KEY"
              className="w-full px-4 py-3 bg-white/05 border border-white/10 rounded-lg text-white text-[11px] font-bold uppercase tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-500/30 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center text-[10px] font-bold uppercase tracking-widest cursor-pointer">
                <input type="checkbox" className="mr-2 accent-red-500" /> Remember me
              </label>
              <Link to="/forgot-password" className="hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest">
                Forgot password?
              </Link>
            </div>
            <motion.button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 py-4 rounded-lg font-black text-white text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "AUTHENTICATING..." : "ESTABLISH CONNECTION"}
            </motion.button>
            {isLoading && <Loader />}
          </motion.form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="px-3 text-[8px] font-bold text-gray-600 uppercase tracking-[0.3em]">External Nodes</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <motion.div
            className="flex justify-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[FaFacebookF, FaGoogle, FaTwitter].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-3 bg-white/05 border border-white/10 rounded-full hover:bg-red-500/10 hover:border-red-500/30 transition-all text-gray-400 hover:text-red-500"
              >
                <Icon />
              </a>
            ))}
          </motion.div>

          <motion.p
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Unauthorized?</span>
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-red-500 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest ml-2"
            >
              Initialize Identity
            </Link>
          </motion.p>
        </div>
      </motion.div >
    </div >
  );
};

export default Login;
