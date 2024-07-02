import { Layout, Menu } from "antd";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const { Header } = Layout;

const Navbar = ({ openStoreModal }) => {
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
      </Menu>
    </Header>
  );
};

export default Navbar;
