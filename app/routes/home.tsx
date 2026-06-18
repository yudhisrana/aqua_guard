import { useEffect } from "react"
import { useLogin } from "~/hooks/use-login"

export default function Home() {
  const { isLoggedIn } = useLogin()

  useEffect(() => {
    if (isLoggedIn) {
      window.location.href = "/dashboard"
    } else {
      window.location.href = "/login"
    }
  }, [isLoggedIn])

  return null
}
