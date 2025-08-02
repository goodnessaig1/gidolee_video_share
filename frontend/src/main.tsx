import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { CACHE_TIME, STALE_TIME } from "./utils/utils.js";
import { AuthProvider } from "./components/context/AuthContests.tsx";

const queryClient = new QueryClient({
  mutationCache: new MutationCache(),
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
