import { useState, useEffect, useContext } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import ShoppingApi from "./api/api";
import RoutesConfig from "./routes-nav/RoutesConfig";
import Navbar from "./routes-nav/Navbar";
import BannerTextRow from "./BannerTextRow";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import { Row, Col, Button } from "antd";
import UserContext from "./UserContext";

const { Content } = Layout;

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const { isUserLoading } = useContext(UserContext);

  if (isLoading || isUserLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Auth0ProviderWithHistory>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Auth0ProviderWithHistory>
  );
}

function UserProvider({ children }) {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } =
    useAuth0();
  const [dbUser, setDbUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    async function getOrCreateUserAfterAuth() {
      if (isAuthenticated && user) {
        setIsUserLoading(true);

        ShoppingApi.setToken(await getAccessTokenSilently());
        try {
          let localUser = await ShoppingApi.getAuthdUser(user.email);
          if (!localUser) {
            localUser = await ShoppingApi.createNewAuthdUser(user);
          }
          setDbUser(localUser);
        } catch (error) {
        } finally {
          setIsUserLoading(false);
        }
      }
    }

    if (isAuthenticated && user && !dbUser) {
      getOrCreateUserAfterAuth();
    }
  }, [isAuthenticated, user]);

  return (
    <UserContext.Provider value={{ dbUser, setDbUser, isUserLoading }}>
      {children}
    </UserContext.Provider>
  );
}

function AppContent() {
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth0();
  const { dbUser } = useContext(UserContext);

  const openStoreModal = () => setIsStoreModalOpen(true);

  async function searchStores() {
    const stores = await ShoppingApi.getStores(dbUser.id);
    setStores(stores);
  }

  const addStore = (newStore) => setStores((stores) => [...stores, newStore]);
  const removeStore = (deletedId) =>
    setStores((stores) => stores.filter((s) => s.id !== deletedId));

  const setExpense = (newExpense) =>
    setExpenses((expenses) => [...expenses, newExpense]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isStoreModalOpen && <div className="overlay show"></div>}
      <Layout>
        <Navbar openStoreModal={openStoreModal} />
        <BannerTextRow location={location} />
        <Content style={{ backgroundColor: "white" }}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/stores" replace />
                ) : (
                  <PublicHomePage />
                )
              }
            />
            <Route
              path="/stores"
              element={
                <PrivateRoute>
                  <RoutesConfig
                    stores={stores}
                    searchStores={searchStores}
                    addStore={addStore}
                    removeStore={removeStore}
                    setExpense={setExpense}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <RoutesConfig
                    stores={stores}
                    searchStores={searchStores}
                    addStore={addStore}
                    removeStore={removeStore}
                    setExpense={setExpense}
                  />
                </PrivateRoute>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </>
  );
}

function PublicHomePage() {
  const { loginWithRedirect } = useAuth0();
  const getOrPersistUser = async () => {
    await loginWithRedirect();
    // let user = useAuth0().user;
  };

  return (
    <Row>
      <Col span={13}>
        <div className="welcome-container">
          <p style={{ fontSize: "45px", color: "white", fontWeight: "bold" }}>
            Welcome to the Shopping List App
          </p>
        </div>
      </Col>
      <Col
        span={11}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            padding: "120px",
            paddingTop: "200px",
            paddingBottom: "200px",
            borderRadius: "5px",
          }}
        >
          <Button
            type="primary"
            onClick={() => getOrPersistUser()}
            style={{ margin: "20px", padding: "30px" }}
          >
            Log In
          </Button>
          <Button type="default" style={{ margin: "20px", padding: "30px" }}>
            Sign Up
          </Button>
        </div>
      </Col>
    </Row>
  );
}

export default App;
