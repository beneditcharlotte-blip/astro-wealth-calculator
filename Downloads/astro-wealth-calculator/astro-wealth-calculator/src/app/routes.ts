import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Analyzing } from "./components/Analyzing";
import { Result } from "./components/Result";
import { Landing } from "./components/Landing";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "form", Component: Home },
      { path: "analyzing", Component: Analyzing },
      { path: "result", Component: Result },
    ],
  },
]);
