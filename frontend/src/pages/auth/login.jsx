import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, Terminal, AlertTriangle } from "lucide-react";
import Loader from "../../components/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
      toast.success("ACCESS_GRANTED");
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || "AUTHENTICATION_FAILED");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050506] text-white px-4 relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(185, 28, 28, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(185, 28, 28, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Scanning Laser */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-red-600/10 z-0 pointer-events-none shadow-[0_0_20px_#ef4444]"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        className="w-full max-w-xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-[#0a0a0b] border border-red-900/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Top Status Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />

          <div className="p-8">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <Shield className="w-7 h-7 text-red-500 animate-pulse" />
                <h2 className="text-4xl font-black uppercase tracking-tighter glitch-text">
                  System <span className="text-red-600">Access</span>
                </h2>
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                Authenticate Identity // Security Clearance Required
              </p>
            </motion.div>

            <motion.form
              onSubmit={submitHandler}
              className="space-y-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Email Field */}
              <div>
                <label className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2 block flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  Email_Identifier
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="email"
                    placeholder="ENTER_EMAIL_ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    className="w-full pl-12 pr-4 py-3 bg-[#111] border border-red-900/30 text-white text-xs font-bold uppercase tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Security_Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="ENTER_SECURITY_KEY"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="off"
                    className="w-full pl-12 pr-12 py-3 bg-[#111] border border-red-900/30 text-white text-xs font-bold tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-[10px] font-bold uppercase tracking-widest cursor-pointer text-gray-500 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 accent-red-500 w-3 h-3"
                  />
                  Remember_Session
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors"
                >
                  Reset_Key?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-3.5 font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(220, 38, 38, 0.5)" }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading ? "AUTHENTICATING_IDENTITY..." : "ESTABLISH_CONNECTION"}
              </motion.button>
            </motion.form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-red-900/20"></div>
              <span className="px-4 text-[8px] font-bold text-gray-600 uppercase tracking-[0.3em]">
                Alternative_Access
              </span>
              <div className="flex-1 h-px bg-red-900/20"></div>
            </div>

            {/* Social Login Placeholder */}
            <motion.div
              className="grid grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {["Google", "GitHub", "Microsoft"].map((provider, idx) => (
                <button
                  key={idx}
                  className="p-2.5 bg-[#111] border border-red-900/20 hover:border-red-500/50 hover:bg-red-900/10 transition-all text-gray-500 hover:text-red-500 text-[9px] font-bold uppercase tracking-wider"
                  onClick={() => toast.info(`${provider}_AUTH_NOT_CONFIGURED`)}
                >
                  {provider}
                </button>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.div
              className="mt-6 pt-5 border-t border-red-900/20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                Unauthorized Access?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="text-red-500 hover:text-red-400 transition-colors ml-2 font-black"
                >
                  Initialize_Identity →
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Bottom Status Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        </div>

        {/* Security Notice */}
        <motion.div
          className="mt-4 p-3 bg-red-900/10 border border-red-900/30 flex items-start gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[9px] text-gray-500 uppercase tracking-wider leading-relaxed">
            <span className="text-red-500 font-bold">Security Notice:</span> All access attempts are logged and monitored. Unauthorized access will be prosecuted.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
