import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { createTheme, MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./main.css";

import Home from "./routes/index.jsx";
import Layout from "./Layout.jsx";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [{ index: true, Component: Home }],
  },
]);

createRoot(document.getElementById("root")).render(
  <MantineProvider theme={theme}>
    <RouterProvider router={router} />
  </MantineProvider>
);
