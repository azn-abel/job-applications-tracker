import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { createTheme, MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./main.css";

import Home from "./routes/index.jsx";
import Heading from "./components/global/Heading/index.jsx";
import Layout from "./Layout.jsx";
import Error from "./Error.jsx";
import NotFound from "./404.jsx";
import Visualize from "./routes/visualize.jsx";
const theme = createTheme({
  /** Put your mantine theme override here */
});

const router = createBrowserRouter([
  {
    path: "/",
    // Component: Layout,
    errorElement: <Error />,
    children: [
      { index: true, Component: Home },
      { path: "visualize", Component: Visualize },
      { path: "*", Component: NotFound },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <MantineProvider theme={theme}>
    <Heading />
    <RouterProvider router={router} />
  </MantineProvider>
);
