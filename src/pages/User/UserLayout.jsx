import React, { useCallback } from "react";
import { Layout, Menu } from "antd";
import { Outlet } from "react-router-dom";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

function UserLayout() {
  const navigate = useNavigate();
  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );
  const items = [getItem("Dashboard", "dashboard", <UnorderedListOutlined />)];
  return (
    <Layout>
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          defaultOpenKeys={["dashboard"]}
          style={{ height: "100%" }}
          items={items}
          onClick={(e) => handleNavigation("user/" + e.key)}
        />
      </Sider>
      <div className="min-h-[700px]">
        <Outlet />
      </div>
    </Layout>
  );
}

export default UserLayout;
