import React, { useCallback } from "react";
import { Layout, Menu } from "antd";
import { Outlet } from "react-router-dom";
import {
  SolutionOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

function LayoutAdmin() {
  const navigate = useNavigate();
  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );
  const items = [
    getItem("Books", "dashboard", <UnorderedListOutlined />),
    getItem("Users", "users", <UsergroupAddOutlined />),
    getItem("Reservation", "reservation", <SolutionOutlined />),
  ];
  return (
    <Layout>
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          defaultOpenKeys={["dashboard"]}
          style={{ height: "100%" }}
          items={items}
          onClick={(e) => handleNavigation("admin/" + e.key)}
        />
      </Sider>
      <div className="min-h-[700px]">
        <Outlet />
      </div>
    </Layout>
  );
}

export default LayoutAdmin;
