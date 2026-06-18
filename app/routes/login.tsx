import { LoginForm } from "~/components/login-form"

import type { Route } from "./+types/login"
import { useLogin } from "~/hooks/use-login"
import { useEffect } from "react"

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
  const { isLoggedIn, isLoadingIn } = useLogin()

  useEffect(() => {
    if (isLoadingIn) return

    if (isLoggedIn) {
      window.location.href = "/dashboard"
    }
  }, [isLoggedIn, isLoadingIn])

  return (
    <div className="w-full max-w-sm md:max-w-4xl">
      <LoginForm />
    </div>
  )
}
