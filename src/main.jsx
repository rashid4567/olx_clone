import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./component/context/authcontext.jsx";
import { ItemsContextProvider } from "./component/context/item.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
 <ItemsContextProvider>
    <AuthProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthProvider>
  </ItemsContextProvider>
  </BrowserRouter>  
 
);
