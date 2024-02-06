import React, { useCallback } from "react";
import { Avatar, Button, Dropdown } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  LoginOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "../pages/Login/currentUserSlice";

function Menu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.currentUser.isLoggedIn);
  const user = useSelector((state) => state.currentUser.user);
  const isAdmin = useSelector((state) => state.currentUser.isAdmin);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    localStorage.clear();
    dispatch(reset());
    navigate("/login");
  }, [navigate, dispatch]);

  return (
    <div className="flex flex-1 w-full h-12 bg-[#34abeb] items-center">
      <div className="flex flex-1 items-center justify-center space-x-2">
        <Button
          type="text"
          icon={<HomeOutlined />}
          onClick={() => handleNavigation("/")}
        >
          Home
        </Button>
        <Button
          type="text"
          icon={<AppstoreOutlined />}
          onClick={() => handleNavigation("category")}
        >
          Category
        </Button>
        {isLoggedIn && isAdmin && (
          <Button
            type="text"
            icon={<DashboardOutlined />}
            onClick={() => handleNavigation("admin/dashboard")}
          >
            Dashboard
          </Button>
        )}
        {isLoggedIn && !isAdmin && (
          <Button
            type="text"
            icon={<DashboardOutlined />}
            onClick={() => handleNavigation("user/dashboard")}
          >
            Dashboard
          </Button>
        )}
      </div>
      <div className="flex pr-3">
        {!isLoggedIn && (
          <Button
            icon={<LoginOutlined />}
            onClick={() => handleNavigation("login")}
          >
            Sign In
          </Button>
        )}
        {isLoggedIn && (
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <div
                      className="flex w-full justify-center min-w-[100px]"
                      onClick={() =>
                        handleNavigation(
                          isAdmin ? "admin/dashboard" : "user/dashboard"
                        )
                      }
                    >
                      Account
                    </div>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <div
                      className="flex w-full justify-center min-w-[100px]"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  ),
                },
              ],
            }}
            placement="bottom"
          >
            <Avatar
              style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
              size="large"
              gap={4}
            >
              {user?.firstName?.[0]}
            </Avatar>
          </Dropdown>
        )}
      </div>
    </div>
  );
}

export default Menu;
