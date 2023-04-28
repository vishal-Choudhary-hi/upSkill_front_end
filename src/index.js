import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./components/modal/form.css";
import NavBar from "./components/navBar/NavBar";
import { UserProvider } from "./components/contexts/userContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProvider>
      <NavBar />
    </UserProvider>
  </React.StrictMode>
);
