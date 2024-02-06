import { Navigate } from "react-router-dom";

const UserRoutes = ({ children }) => {
  const token = localStorage.getItem("token");
  const isUser = localStorage.getItem("isUser");
  return token && isUser === "true" ? (
    <> {children} </>
  ) : (
    <Navigate to="/login" />
  );
};

export default UserRoutes;
