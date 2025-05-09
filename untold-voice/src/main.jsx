import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {UserContextProvider} from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <App />
  </UserContextProvider>
);
