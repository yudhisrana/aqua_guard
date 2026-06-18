import { type RouteConfig, layout, route } from "@react-router/dev/routes"

export default [
  // Home
  route("/", "routes/home.tsx"),

  // Auth
  layout("layouts/auth-layout.tsx", [route("login", "routes/login.tsx")]),

  // Main App
  route("dashboard", "routes/dashboard.tsx"),
  route("device-info", "routes/device-info.tsx"),
  route("settings", "routes/settings.tsx"),
] satisfies RouteConfig
