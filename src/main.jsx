import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="492914236919-f506acklj1hkhfba2g9igum1s5evihp0.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
