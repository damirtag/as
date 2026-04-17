import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <div>
      <header>App Header</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
