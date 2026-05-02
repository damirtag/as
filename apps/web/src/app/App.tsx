import { useEffect } from "react";
import { AppRouter } from "./router";
import { useAuthStore } from "@/shared/lib";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <AppRouter />;
}

export default App;