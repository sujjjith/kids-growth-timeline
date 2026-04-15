import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Timeline } from "./pages/Timeline";
import { KidProfile } from "./pages/KidProfile";
import { GrowthCharts } from "./pages/GrowthCharts";
import { Login } from "./pages/Login";
import { AuthCallback } from "./pages/AuthCallback";
import { isAuthenticated } from "./api/auth";

// eslint-disable-next-line react-refresh/only-export-components
function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/auth/callback",
      element: <AuthCallback />,
    },
    {
      path: "/",
      element: (
        <RequireAuth>
          <AppLayout />
        </RequireAuth>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "timeline", element: <Timeline /> },
        { path: "kids/:kidId", element: <KidProfile /> },
        { path: "growth", element: <GrowthCharts /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
