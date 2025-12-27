import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import { ListSkeleton } from "../../components/LoadingSkeleton";
import {
    Search,
    User,
    Shield,
    Trash2,
    Edit2,
    Check,
    X,
    Filter,
    AlertTriangle,
    Terminal,
    Eye,
    MoreVertical
} from "lucide-react";
import { toast } from "react-toastify";

const AdminUsers = () => {
    const { data: users, isLoading, refetch } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({ username: "", email: "", isAdmin: false });

    // Filter Users
    const filteredUsers = users?.filter((user) => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" ? true : roleFilter === "admin" ? user.isAdmin : !user.isAdmin;
        return matchesSearch && matchesRole;
    });

    const handleDelete = async () => {
        try {
            await deleteUser(selectedUser._id).unwrap();
            toast.success("USER_RECORD_PURGED");
            setShowDeleteModal(false);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "PURGE_FAILED");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUser({
                userId: selectedUser._id,
                username: editFormData.username,
                email: editFormData.email,
                isAdmin: editFormData.isAdmin,
            }).unwrap();
            toast.success("USER_PROFILE_UPDATED");
            setShowEditModal(false);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "UPDATE_FAILED");
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditFormData({
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        });
        setShowEditModal(true);
    };

    const confirmDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-red-900/30 pb-6 gap-4">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white glitch-text mb-2">
                        User <span className="text-red-500">Registry</span>
                    </h1>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <Terminal className="w-3 h-3" />
                        <span>System_Personnel_Database</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-red-900/10 px-4 py-2 border border-red-900/30">
                    <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Total_Entities</div>
                        <div className="text-2xl font-black text-white leading-none">{users?.length || 0}</div>
                    </div>
                    <User className="w-8 h-8 text-red-500/50" />
                </div>
            </div>

            {/* Controls */}
            <div className="bg-[#0a0a0b] border border-red-900/30 p-1 flex flex-col md:flex-row gap-0">
                <div className="flex-1 flex items-center relative border-b md:border-b-0 md:border-r border-red-900/30">
                    <Search className="absolute left-4 w-4 h-4 text-red-500" />
                    <input
                        type="text"
                        placeholder="SEARCH_PERSONNEL_ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-white text-xs font-bold uppercase tracking-widest py-4 pl-12 focus:outline-none placeholder-gray-700"
                    />
                </div>
                <div className="flex items-center">
                    <Filter className="w-4 h-4 text-gray-500 ml-4 hidden md:block" />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-transparent text-gray-400 text-xs font-bold uppercase tracking-widest px-6 py-4 focus:outline-none cursor-pointer hover:bg-white/5 transition-colors"
                    >
                        <option value="all" className="bg-[#0a0a0b]">ALL_ROLES</option>
                        <option value="admin" className="bg-[#0a0a0b]">COMMAND_STAFF</option>
                        <option value="user" className="bg-[#0a0a0b]">OPERATIVES</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            {isLoading ? (
                <ListSkeleton count={8} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {filteredUsers?.map((user) => (
                            <motion.div
                                key={user._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative bg-[#0a0a0b] border border-red-900/20 hover:border-red-500/50 transition-all duration-300 overflow-hidden"
                            >
                                {/* Scanline Effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-[100%] transition-all duration-1000 pointer-events-none" />

                                <div className="p-6 relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 border border-red-900/50 p-0.5">
                                                <img
                                                    src={user.profilePic || `https://ui-avatars.com/api/?name=${user.username}&background=0a0a0b&color=ef4444`}
                                                    alt={user.username}
                                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            </div>
                                            {user.isAdmin && (
                                                <div className="absolute -top-1 -right-1 bg-red-600 text-black p-0.5 animate-pulse">
                                                    <Shield className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 border border-blue-900/30 text-blue-500 hover:bg-blue-500/10 hover:border-blue-500 transition-colors"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(user)}
                                                className="p-2 border border-red-900/30 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-wider truncate">{user.username}</h3>
                                        <p className="text-[10px] text-gray-500 font-mono break-all">{user.email}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-red-900/20">
                                        <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border ${user.isAdmin ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-gray-700 text-gray-500'}`}>
                                            {user.isAdmin ? 'COMMAND_AUTH' : 'OPERATIVE'}
                                        </div>
                                        <div className="text-[10px] text-gray-600 font-mono">
                                            ID: {user._id.slice(-4)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEditModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-[#0a0a0b] border border-blue-500/50 w-full max-w-md shadow-[0_0_50px_rgba(59,130,246,0.2)] p-1"
                        >
                            <div className="bg-blue-900/20 p-6">
                                <h3 className="text-xl font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Edit2 className="w-5 h-5" />
                                    Modify_Profile
                                </h3>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Username</label>
                                        <input
                                            type="text"
                                            value={editFormData.username}
                                            onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                                            className="w-full bg-black/50 border border-blue-900/30 p-3 text-white text-xs font-bold focus:border-blue-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Email_Address</label>
                                        <input
                                            type="email"
                                            value={editFormData.email}
                                            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                            className="w-full bg-black/50 border border-blue-900/30 p-3 text-white text-xs font-bold focus:border-blue-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 pt-2">
                                        <input
                                            type="checkbox"
                                            id="isAdmin"
                                            checked={editFormData.isAdmin}
                                            onChange={(e) => setEditFormData({ ...editFormData, isAdmin: e.target.checked })}
                                            className="w-4 h-4 bg-black border border-blue-500 rounded-none cursor-pointer"
                                        />
                                        <label htmlFor="isAdmin" className="text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer select-none">
                                            Grant_Command_Auth
                                        </label>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditModal(false)}
                                            className="flex-1 py-3 border border-gray-700 text-gray-500 hover:text-white hover:border-white transition-colors text-xs font-black uppercase tracking-widest"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                                        >
                                            Update_Record
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-[#0a0a0b] border border-red-600 w-full max-w-sm shadow-[0_0_50px_rgba(220,38,38,0.4)]"
                        >
                            <div className="p-8 text-center">
                                <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-6 animate-pulse" />
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Confirm_Purge</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">
                                    Permanently erase user record: <span className="text-red-500">{selectedUser?.username}</span>?
                                    <br />This action cannot be undone.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 py-4 border border-gray-700 text-gray-500 hover:text-white hover:border-white transition-colors text-xs font-black uppercase tracking-widest"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                    >
                                        Execute_Purge
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
