
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Vehicles from "./pages/Vehicles";
import Home from "./pages/Index";
import CarDetails from "./pages/VehicleDetail";
import Financing from "./pages/Financing";
import Contact from "./pages/NotFound";
import About from "./pages/NotFound";
import Terms from "./pages/NotFound";
import Privacy from "./pages/NotFound";
import Schedule from "./pages/NotFound";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/admin/Dashboard";
import AdminCars from "./pages/admin/CarsList";
import AdminFinancing from "./pages/admin/FinancingRequests";
import AdminUsers from "./pages/NotFound";
import AdminSchedule from "./pages/NotFound";
import AdminSettings from "./pages/NotFound";
import CreateCar from "./pages/admin/CreateCar";
import EditCar from "./pages/admin/EditCar";
import Login from "./pages/admin/Login";
import DiagnosticoUpload from "./pages/admin/DiagnosticoUpload";
import TestUpload from "./pages/TestUpload";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/vehicles",
    element: <Vehicles />,
  },
  {
    path: "/vehicle/:id",
    element: <CarDetails />,
  },
  {
    path: "/financing",
    element: <Financing />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/schedule",
    element: <Schedule />,
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "admin/painel",
    element: <AdminPanel />,
  },
  {
    path: "admin/painel/cars",
    element: <AdminCars />,
  },
  {
    path: "admin/painel/cars/create",
    element: <CreateCar />,
  },
  {
    path: "admin/painel/cars/edit/:id",
    element: <EditCar />,
  },
  {
    path: "admin/painel/financing",
    element: <AdminFinancing />,
  },
  {
    path: "admin/painel/users",
    element: <AdminUsers />,
  },
  {
    path: "admin/painel/schedule",
    element: <AdminSchedule />,
  },
  {
    path: "admin/painel/settings",
    element: <AdminSettings />,
  },
  {
    path: "admin/painel/diagnostico-upload",
    element: <DiagnosticoUpload />
  },
  {
    path: "admin/painel/test-upload",
    element: <TestUpload />
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
