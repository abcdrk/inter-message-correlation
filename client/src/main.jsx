import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import MatchedList from "./components/MatchedList";
import Matched from "./components/Matched";
import OrdersList from "./components/OrdersList";
import Order from "./components/Order";
import RulesList from "./components/RulesList";
import Rule from "./components/Rule";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <RulesList />,
      },
    ],
  },
  {
    path: "/listMatched",
    element: <App />,
    children: [
      {
        path: "/listMatched",
        element: <MatchedList />,
      },
    ],
  },
  {
    path: "/listRules",
    element: <App />,
    children: [
      {
        path: "/listRules",
        element: <RulesList />,
      },
    ],
  },
  {
    path: "/listOrders",
    element: <App />,
    children: [
      {
        path: "/listOrders",
        element: <OrdersList />,
      },
    ],
  },
  {
    path: "/createMatched",
    element: <App />,
    children: [
      {
        path: "/createMatched",
        element: <Matched />,
      },
    ],
  },
  {
    path: "/createRule",
    element: <App />,
    children: [
      {
        path: "/createRule",
        element: <Rule />,
      },
    ],
  },
  {
    path: "/createOrder",
    element: <App />,
    children: [
      {
        path: "/createOrder",
        element: <Order />,
      },
    ],
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
