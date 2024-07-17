import { Layout, Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Navbar.css";
import ManageCategoriesModal from "../category/ManageCategoriesModal";
import React, { useState } from "react";

const { Header } = Layout;

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth0();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#fff",
  };
  const openCategoryModal = (e) => {
    e.preventDefault();
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  return (
    <Header style={headerStyle}>
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={["/stores"]}
        style={{ flex: 1, minWidth: 0 }}
        activeBarHeight="30"
      >
        {!isAuthenticated && (
          <Menu.Item key="/">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          </Menu.Item>
        )}
        {isAuthenticated && (
          <>
            <Menu.Item key="/stores">
              <NavLink className="nav-link" to="/stores">
                Stores
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/setting">
              <NavLink className="nav-link" onClick={openCategoryModal}>
                Manage Categories
              </NavLink>
            </Menu.Item>
            <Menu.Item key="auth" style={{ marginLeft: "auto" }}>
              <NavLink
                className="nav-link"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Log Out
              </NavLink>
            </Menu.Item>
          </>
        )}
      </Menu>
      <ManageCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
      />
    </Header>
  );
};

export default Navbar;
