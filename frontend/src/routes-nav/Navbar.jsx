import { Layout, Menu } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Navbar.css";

const { Header } = Layout;

const Navbar = ({ openStoreModal }) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();

  const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#fff",
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
        <Menu.Item key="/">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>
        </Menu.Item>
        {isAuthenticated && (
          <>
            <Menu.Item key="/stores">
              <NavLink className="nav-link" to="/stores">
                Stores
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/addStore">
              <NavLink className="nav-link" onClick={openStoreModal}>
                Add a store
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/profile">
              <NavLink className="nav-link">Profile</NavLink>
            </Menu.Item>
          </>
        )}
        <Menu.Item key="auth" style={{ marginLeft: "auto" }}>
          {isAuthenticated ? (
            <NavLink
              className="nav-link"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log Out
            </NavLink>
          ) : (
            <NavLink className="nav-link" onClick={() => loginWithRedirect()}>
              Log In
            </NavLink>
          )}
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navbar;
