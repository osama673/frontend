import React from "react";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="bg-[#fafafa]">
      <Menu />
      <div className="p-4 min-h-[700px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
