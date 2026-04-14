import { createBrowserRouter } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import { AppLayout } from "./components/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Timeline } from "./pages/Timeline";
import { KidProfile } from "./pages/KidProfile";
import { GrowthCharts } from "./pages/GrowthCharts";

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "timeline", element: <Timeline /> },
        { path: "kids/:kidId", element: <KidProfile /> },
        { path: "growth", element: <GrowthCharts /> },
      ],
    },
    {
      // This is the route defined in your application's redirect URL
      path: "/auth/callback",
      element: <AuthCallback />,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
