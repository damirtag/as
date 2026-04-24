import { Outlet } from "react-router-dom";
import { Header, Footer } from "@/widgets";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
