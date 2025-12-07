import { createRoot } from "react-dom/client";
import "./styles/global.css";
import "./index.css";
import { Provider } from "react-redux";
import WalletProvider from "./providers/WalletProvider.jsx";
import { store } from "./store/store.js";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <WalletProvider>
      <App />
    </WalletProvider>
  </Provider>
);
