import { useState, useEffect, useCallback, useContext } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Layout, Row, Col, Button } from "antd";
import ShoppingApi from "./api/api";
import RoutesConfig from "./routes-nav/RoutesConfig";
import Navbar from "./routes-nav/Navbar";
import BannerTextRow from "./BannerTextRow";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
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

  const fetchUser = useCallback(async () => {
    if (isAuthenticated && user) {
      setIsUserLoading(true);
      try {
        const token = await getAccessTokenSilently();
        ShoppingApi.setToken(token);
        let localUser = await ShoppingApi.getAuthdUser(user.email);
        if (!localUser) {
          localUser = await ShoppingApi.createNewAuthdUser(user);
        }
        setDbUser(localUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        // Consider adding user-friendly error handling here
      } finally {
        setIsUserLoading(false);
      }
    } else {
      setIsUserLoading(false);
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  useEffect(() => {
    if (!isLoading) {
      fetchUser();
    }
  }, [isLoading, fetchUser]);

  const refreshUser = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{ dbUser, setDbUser, isUserLoading, refreshUser }}
    >
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
    try {
      const stores = await ShoppingApi.getStores(dbUser.id);
      setStores(stores || []);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setStores([]);
    }
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
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            onClick={() => getOrPersistUser()}
            style={{ fontSize: "18px", padding: "12px 24px", height: "auto" }}
          >
            Log In / Sign Up
          </Button>
          <p style={{ marginTop: "20px", textAlign: "center" }}>
            Click to log in or create a new account
          </p>
        </div>
      </Col>
    </Row>
  );
}

export default App;
