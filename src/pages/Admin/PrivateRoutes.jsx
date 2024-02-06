import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const isUser = localStorage.getItem("isUser");
  const isAdmin = useSelector((state) => state.currentUser.isAdmin);
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
