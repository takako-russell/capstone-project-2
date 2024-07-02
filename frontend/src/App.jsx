import { useState, useEffect } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import ShoppingApi from "./api/api";
import RoutesConfig from "./routes-nav/RoutesConfig";
import Navbar from "./routes-nav/Navbar";
import BannerTextRow from "./BannerTextRow";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import { useAuth0 } from "@auth0/auth0-react";

const { Content } = Layout;

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Auth0ProviderWithHistory>
      <AppContent />
    </Auth0ProviderWithHistory>
  );
}

function AppContent() {
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth0();

  const openStoreModal = () => setIsStoreModalOpen(true);

  async function searchStores() {
    const stores = await ShoppingApi.getStores();
    setStores(stores);
  }

  const addStore = (newStore) => setStores((stores) => [...stores, newStore]);
  const removeStore = (deletedId) =>
    setStores((stores) => stores.filter((s) => s.id !== deletedId));

  const addExpense = (newExpense) =>
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
        <Content style={{ paddingTop: 45, backgroundColor: "white" }}>
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
                    addExpense={addExpense}
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
                    addExpense={addExpense}
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

  return (
    <div>
      <h1>Welcome to the Shopping List App</h1>
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  );
}

export default App;
