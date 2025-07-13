import { createRoot } from "react-dom/client";
import App from "./App";
import SimpleApp from "./SimpleApp";
import "./index.css";

// Temporarily use SimpleApp to isolate the issue
createRoot(document.getElementById("root")!).render(<SimpleApp />);
