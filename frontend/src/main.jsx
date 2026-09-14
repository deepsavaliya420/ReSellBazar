import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "./context/AuthContext";

import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/home.css";
import "./styles/products.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/responsive.css";
import "./styles/cart.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
);