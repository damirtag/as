import { useEffect } from "react";
import { AppRouter } from "./router";
import { useAuthStore } from "@/shared/lib";
import { usePresenceSocket } from "@/shared/lib/presence";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  usePresenceSocket(isAuthenticated);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <AppRouter />;
}

export default App;