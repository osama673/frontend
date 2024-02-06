import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Login from "./pages/Login/Login";
import MyBooks from "./pages/Admin/MyBooks";
import NewAccount from "./pages/Login/NewAccount";
import LayoutAdmin from "./pages/Admin/LayoutAdmin";
import Users from "./pages/Admin/Users";
import Details from "./pages/Details";
import UserLayout from "./pages/User/UserLayout";
import PrivateUserRoutes from "./pages/User/PrivateUserRoutes";
import Dashboard from "./pages/User/Dashboard";
import Reservation from "./pages/Admin/Reservation";
import AdminRoutes from "./pages/Admin/AdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="category" element={<Category />} />
        <Route path="login" element={<Login />} />
        <Route element={<NewAccount />} path="account" />

        <Route element={<LayoutAdmin />}>
          <Route
            element={
              <AdminRoutes>
                <MyBooks />
              </AdminRoutes>
            }
            path="admin/dashboard"
          />
          <Route
            element={
              <AdminRoutes>
                <Users />
              </AdminRoutes>
            }
            path="admin/users"
          />
          <Route
            element={
              <AdminRoutes>
                <Reservation />
              </AdminRoutes>
            }
            path="admin/reservation"
          />
        </Route>
        <Route element={<PrivateUserRoutes />}>
          <Route element={<UserLayout />}>
            <Route element={<Dashboard />} path="user/dashboard" />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
