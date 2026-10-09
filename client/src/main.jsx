import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// запускаем React: рисуем компонент App внутри <div id="root">
createRoot(document.getElementById("root")).render(<App />);
