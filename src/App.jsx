import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app_wrapper">
      <Header />
      <div className="page_wrapper">
        <Home />
      </div>
    </div>
  );
}

export default App;
