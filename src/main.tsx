import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CitiesTable from "./CitiesTable.tsx";
import { lazy } from "react";

const Weather = lazy(() => import("./Weather.tsx"));
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
   {
      path: "/",
      element: <CitiesTable />,
   },
   {
      path: "/:city",
      element: <Weather />,
   },
]);

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <RouterProvider router={router} />
   </StrictMode>
);
