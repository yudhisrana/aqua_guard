import { LoginForm } from "~/components/login-form"

import type { Route } from "./+types/login"

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: "AquaGuard - Login",
    },
    {
      name: "description",
      content: "Login to your AquaGuard account to access your dashboard.",
    },
  ]
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm md:max-w-4xl">
      <LoginForm />
    </div>
  )
}
