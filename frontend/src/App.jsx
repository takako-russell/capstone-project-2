import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "antd";
import ShoppingApi from "./api/api";
import RoutesConfig from "./routes-nav/RoutesConfig";
import StoreModal from "./store/StoreModal";
import Navbar from "./routes-nav/Navbar"; // Import Navbar
import BannerTextRow from "./BannerTextRow"; // Import BannerTextRow

const { Content } = Layout;

function App() {
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const location = useLocation();

  const openStoreModal = () => setIsStoreModalOpen(true);
  const closeStoreModal = () => setIsStoreModalOpen(false);

  async function searchStores() {
    const stores = await ShoppingApi.getStores();
    setStores(stores);
  }

  const addStore = (newStore) => setStores((stores) => [...stores, newStore]);
  const removeStore = (deletedId) =>
    setStores((stores) => stores.filter((s) => s.id !== deletedId));

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
            removeStore={removeStore}
            showAddStoreModal={openStoreModal}
          />
        </Content>
        <StoreModal
          isStoreModalOpen={isStoreModalOpen}
          closeStoreModal={closeStoreModal}
          addStore={addStore}
          searchStores={searchStores}
        />
      </Layout>
    </>
  );
}

export default App;
