import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./styles/leaflet-custom.css";
import "./index.css";
import "./i18n/config";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
