import { createRoot } from "react-dom/client";
import App from "./App";
import MinimalTest from "./MinimalTest";
import "./index.css";

// Use minimal test to verify React is working
createRoot(document.getElementById("root")!).render(<MinimalTest />);
