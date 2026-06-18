import React, { useEffect } from "react"

export function useLogin() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [isLoadingIn, setIsLoadingIn] = React.useState(true)

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loginStatus)
    setIsLoadingIn(false)
  }, [])

  return { isLoggedIn, isLoadingIn }
}
