import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Vehicles from "./pages/Vehicles";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Financing from "./pages/Financing";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Schedule from "./pages/Schedule";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminCars from "./pages/admin/cars/AdminCars";
import AdminFinancing from "./pages/admin/AdminFinancing";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSchedule from "./pages/admin/AdminSchedule";
import AdminSettings from "./pages/admin/AdminSettings";
import CreateCar from "./pages/admin/CreateCar";
import EditCar from "./pages/admin/EditCar";
import Login from "./pages/admin/Login";
import DiagnosticoUpload from "./pages/admin/DiagnosticoUpload";

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
