import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setCredentials } from "../../redux/features/authSlice";
import { useRegisterMutation } from "../../redux/api/userApiSlice";
import Loader from "../../components/loader";
import { toast } from "react-toastify";
import { Shield, User, Mail, Phone, Lock, Upload, Eye, EyeOff, Terminal } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("IMAGE_TOO_LARGE: Max 5MB allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions (max 800x800)
          let width = img.width;
          let height = img.height;
          const maxSize = 800;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

          setProfilePic(compressedDataUrl);
          setPreviewImage(compressedDataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("SECURITY_KEY_MISMATCH");
    } else {
      try {
        const newUser = { username, phone, email, password, profilePic };
        const res = await register(newUser).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("IDENTITY_INITIALIZED_SUCCESSFULLY");
      } catch (error) {
        console.error("Error registering user:", error);
        toast.error(error.data?.message || "INITIALIZATION_FAILED");
      }
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
        className="w-full max-w-5xl relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-[#0a0a0b] border border-red-900/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Top Status Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />

          <div className="p-12">
            {/* Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-red-500 animate-pulse" />
                <h2 className="text-5xl font-black uppercase tracking-tighter glitch-text">
                  Identity <span className="text-red-600">Registration</span>
                </h2>
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                Initialize New Operator Profile // Security Clearance Required
              </p>
            </motion.div>

            <motion.form
              onSubmit={submitHandler}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Left Column - Profile Picture */}
              <div className="lg:col-span-1 flex flex-col items-center">
                <div className="relative w-full max-w-[280px]">
                  {/* Profile Picture Container */}
                  <div className="relative aspect-square">
                    {/* Rotating Outer Ring */}
                    <motion.div
                      className="absolute inset-0 border-2 border-dashed border-red-700/30 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Ring */}
                    <motion.div
                      className="absolute inset-4 border border-red-600/20 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Image Display */}
                    <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-red-600/50 bg-black flex items-center justify-center">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-20 h-20 text-gray-700" />
                      )}
                    </div>

                    {/* Corner Markers */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600" />
                  </div>

                  {/* Upload Button */}
                  <label className="mt-6 w-full cursor-pointer">
                    <div className="w-full py-3 bg-red-600/10 border border-red-600/30 hover:bg-red-600 hover:text-white text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload_Identity_Image
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <p className="text-gray-600 text-[8px] uppercase tracking-wider text-center mt-3">
                    Optional // Max 5MB // JPG/PNG
                  </p>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Username */}
                <div>
                  <label className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2 block flex items-center gap-2">
                    <Terminal className="w-3 h-3" />
                    Operator_Codename
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      placeholder="ENTER_CODENAME"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="off"
                      className="w-full pl-12 pr-4 py-3 bg-[#111] border border-red-900/30 text-white text-xs font-bold uppercase tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      Secure_Channel
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="email"
                        placeholder="EMAIL_ADDRESS"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="off"
                        className="w-full pl-12 pr-4 py-3 bg-[#111] border border-red-900/30 text-white text-xs font-bold uppercase tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      Contact_Vector
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="tel"
                        placeholder="PHONE_NUMBER"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        autoComplete="off"
                        className="w-full pl-12 pr-4 py-3 bg-[#111] border border-red-900/30 text-white text-xs font-bold uppercase tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full pl-12 pr-12 py-3 bg-[#111] border border-red-900/30 text-white text-xs font-bold uppercase tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-500 transition-colors"
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

                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Confirm_Key
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="CONFIRM_SECURITY_KEY"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="off"
                        className="w-full pl-12 pr-12 py-3 bg-[#111] border border-red-900/30 text-white text-xs font-bold uppercase tracking-widest placeholder-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-4 font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                  whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(220, 38, 38, 0.5)" }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? "INITIALIZING_IDENTITY..." : "INITIALIZE_OPERATOR_ACCOUNT"}
                </motion.button>
              </div>
            </motion.form>

            {/* Footer */}
            <motion.div
              className="mt-12 pt-8 border-t border-red-900/20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                Existing Identity Detected?{" "}
                <Link
                  to={redirect ? `/login?redirect=${redirect}` : "/login"}
                  className="text-red-500 hover:text-red-400 transition-colors ml-2 font-black"
                >
                  Establish_Connection →
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Bottom Status Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
