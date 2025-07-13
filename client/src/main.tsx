import { createRoot } from "react-dom/client";
import App from "./App";
import MinimalApp from "./MinimalApp";
import "./index.css";

// Use minimal app to test basic functionality
createRoot(document.getElementById("root")!).render(<MinimalApp />);
