import { type RouteConfig, layout, route } from "@react-router/dev/routes"

export default [
  // Auth
  layout("layouts/auth-layout.tsx", [route("login", "routes/login.tsx")]),

  // Main App
  route("dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig
