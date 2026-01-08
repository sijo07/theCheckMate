import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};
export default AdminRoute;
