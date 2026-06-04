import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId="492914236919-f506acklj1hkhfba2g9igum1s5evihp0.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
    ,
  </QueryClientProvider>,
);
