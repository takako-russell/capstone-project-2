import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "antd";
import ShoppingApi from "./api/api";
import RoutesConfig from "./routes-nav/RoutesConfig";
import StoreModal from "./store/StoreModal";
import Navbar from "./routes-nav/Navbar"; // Import Navbar
import BannerTextRow from "./BannerTextRow"; // Import BannerTextRow
import ExpenseModal from "./chart/ExpenseModal";

const { Content } = Layout;

function App() {
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  const [stores, setStores] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const location = useLocation();

  const openStoreModal = () => setIsStoreModalOpen(true);
  const closeStoreModal = () => setIsStoreModalOpen(false);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const openExpenseModal = () => setIsExpenseModalOpen(true);
  const closeExpenseModal = () => setIsExpenseModalOpen(false);

  async function searchStores() {
    const stores = await ShoppingApi.getStores();
    setStores(stores);
  }

  const addStore = (newStore) => setStores((stores) => [...stores, newStore]);
  const removeStore = (deletedId) =>
    setStores((stores) => stores.filter((s) => s.id !== deletedId));

  const addExpense = (newExpense) =>
    setExpenses((expenses) => [...expenses, newExpense]);

  return (
    <>
      {isStoreModalOpen && <div className="overlay show"></div>}
      <Layout>
        <Navbar openStoreModal={openStoreModal} /> {/* Use Navbar */}
        <BannerTextRow location={location} /> {/* Use BannerTextRow */}
        <Content style={{ paddingTop: 45, backgroundColor: "white" }}>
          <RoutesConfig
            stores={stores}
            searchStores={searchStores}
            addStore={addStore}
            removeStore={removeStore}
            addExpense={addExpense}
          />
        </Content>
      </Layout>
    </>
  );
}

export default App;
