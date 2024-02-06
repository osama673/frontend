import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoutes = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = useSelector((state) => state.currentUser.isAdmin);
  return token && isAdmin ? <> {children} </> : <Navigate to="/login" />;
};

export default AdminRoutes;
