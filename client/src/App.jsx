import { useEffect, useState } from "react";
import "./App.css";
import Home from "./components/Home";
import InventoryView from "./components/InventoryView";

function App() {
  const [view, setView] = useState("home"); // "home" | "inventory"

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (view === "inventory") {
    return <InventoryView onBack={() => setView("home")} />;
  }

  return <Home onInventory={() => setView("inventory")} />;
}

export default App;
