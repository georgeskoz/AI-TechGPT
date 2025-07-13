import { createRoot } from "react-dom/client";
import App from "./App";
import TestApp from "./TestApp";
import "./index.css";

// Test basic React functionality
createRoot(document.getElementById("root")!).render(<TestApp />);
