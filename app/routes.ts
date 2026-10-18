import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("tools/wealth-calculator", "routes/financial-simulator.tsx"),
] satisfies RouteConfig;
