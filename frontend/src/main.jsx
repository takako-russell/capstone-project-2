import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

const testGreenColor = "#008000";
const testRedColor = "#802D15";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: testRedColor,
          },
          components: {
            Menu: {
              itemHoverColor: testRedColor,
              // itemSelectedColor: "#567714",
              // itemBorderRadius: 1,
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
