import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "../../redux/api/userApiSlice";
import { Shield, Cpu, Activity, Save, Lock, Terminal, User, Camera } from "lucide-react";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const fileInputRef = useRef(null);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB before compression)
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
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("PASSWORDS_DO_NOT_MATCH");
      return;
    }
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        phone,
        email,
        password,
        profilePic,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("IDENTITY_PROTOCOL_UPDATED");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-white font-mono relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(185, 28, 28, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(185, 28, 28, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Scanning Line */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-red-600/10 z-0 pointer-events-none shadow-[0_0_20px_#ef4444]"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8">

        {/* Tactical Identity Module (Left) */}
        <motion.div
          className="md:col-span-5 flex flex-col items-center justify-center relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            {/* Rotating Technical Rings */}
            <motion.div
              className="absolute inset-0 border border-dashed border-red-800/50 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 border border-red-600/30 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 border-t-2 border-red-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Avatar Core */}
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#050506] relative z-20 bg-black group">
              <img
                src={profilePic || userInfo?.profilePic || `https://ui-avatars.com/api/?name=${userInfo?.username}&background=000&color=fff`}
                alt="AGENT_ID"
                className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-50"
              />
              <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay" />

              {/* Upload Trigger */}
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 cursor-pointer"
              >
                <Camera className="w-8 h-8 text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                <span className="text-[10px] uppercase tracking-widest text-white font-bold bg-black/50 px-2 py-1 rounded border border-red-500/30 backdrop-blur-sm">Upload_ID</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* HUD Markers */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-[10px] text-red-500 tracking-[0.3em]">IDENTITY_CORE</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 flex flex-col items-center">
              <span className="text-2xl font-black uppercase text-white tracking-widest">{userInfo?.username}</span>
              <span className="text-[10px] text-red-500/70 tracking-[0.2em] mt-1">SEC_CLEARANCE_LVL_4</span>
            </div>
          </div>

          {/* Stats Block */}
          <div className="w-full grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/05 border border-red-900/20 p-4 rounded-sm">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Session_ID</div>
              <div className="text-sm text-red-400 font-mono">XF-99-2049</div>
            </div>
            <div className="bg-white/05 border border-red-900/20 p-4 rounded-sm">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Node_Status</div>
              <div className="text-sm text-emerald-400 font-mono">CONNECTED</div>
            </div>
          </div>
        </motion.div>

        {/* Console Entry Terminal (Right) */}
        <motion.div
          className="md:col-span-7 bg-[#0a0a0b] border border-red-900/30 p-8 relative overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute top-0 left-0 w-2 h-20 bg-red-600" />
          <div className="flex items-center gap-4 mb-8 border-b border-red-900/20 pb-4">
            <Terminal className="text-red-500 w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-white">Update_Profile_Parameters</h2>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">

            <div className="group">
              <label className="text-[10px] text-red-500/70 uppercase tracking-wider mb-1 block">Agent_Designation (Username)</label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-transparent border-b border-red-900/30 py-2 pl-8 text-white font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-700"
                  placeholder="ENTER_DESIGNATION"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] text-red-500/70 uppercase tracking-wider mb-1 block">Comm_Link_ID (Email)</label>
              <div className="relative">
                <Activity className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-red-900/30 py-2 pl-8 text-white font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-700"
                  placeholder="ENTER_EMAIL_PROTOCOL"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] text-red-500/70 uppercase tracking-wider mb-1 block">Signal_Frequency (Phone)</label>
              <div className="relative">
                <Cpu className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-red-900/30 py-2 pl-8 text-white font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-700"
                  placeholder="ENTER_FREQUENCY"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] text-red-500/70 uppercase tracking-wider mb-1 block">Security_Cipher (New Password)</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-red-900/30 py-2 pl-8 text-white font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-700"
                  placeholder="OVERRIDE_CIPHER"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] text-red-500/70 uppercase tracking-wider mb-1 block">Verify_Cipher (Confirm Password)</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-red-900/30 py-2 pl-8 text-white font-mono focus:outline-none focus:border-red-500 transition-colors placeholder-gray-700"
                  placeholder="CONFIRM_OVERRIDE"
                />
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-red-900/20 border border-red-600 text-red-500 py-3 uppercase tracking-widest text-xs font-bold hover:bg-red-600 hover:text-white transition-all group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {isLoading ? "Rewriting_Buffer..." : "Initiate_Update"}
                </span>
                <div className="absolute inset-0 bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
              </button>

              <Link to="/changePassword"
                className="flex-1 bg-gray-900/50 border border-gray-700 text-gray-400 py-3 uppercase tracking-widest text-xs font-bold hover:border-gray-500 hover:text-white transition-all flex items-center justify-center gap-2 text-center"
              >
                <Shield className="w-4 h-4" />
                Security_Log
              </Link>
            </div>
            {isLoading && <Loader />}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
