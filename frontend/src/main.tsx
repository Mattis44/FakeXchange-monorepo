import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "./routes/Router";
import { useWebSocketStore } from "./stores/websocket";
import { useEffect } from "react";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function WsInit({ children }: { children: React.ReactNode }) {
  const connect = useWebSocketStore((s) => s.connect);
  useEffect(() => {
    connect();
  }, [connect]);
  return <>{children}</>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WsInit>
        <Router />
      </WsInit>
    </QueryClientProvider>
  </StrictMode>
);
