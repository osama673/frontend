import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateUserRoutes = () => {
  const isLoggedIn = useSelector((state) => state.currentUser.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateUserRoutes;
