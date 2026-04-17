import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
