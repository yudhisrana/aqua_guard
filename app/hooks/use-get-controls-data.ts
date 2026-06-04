import { useEffect, useState } from "react"
import { getDatabase, onValue, ref } from "firebase/database"
import { app } from "~/lib/firebase/init-firebase"
import type { ControlsData } from "~/types"

export function useGetControlsData() {
  const [controlsData, setControlsData] = useState<ControlsData>({
    buzzer: false,
    forceRefresh: false,
  })

  useEffect(() => {
    const db = getDatabase(app)
    const deviceRef = ref(db, "devices/aquaguard-01")

    const unsubscribe = onValue(deviceRef, (snapshot) => {
      const data = snapshot.val() as ControlsData | null

      if (data) {
        setControlsData((current) => ({ ...current, ...data }))
      }
    })

    return () => unsubscribe()
  }, [])

  return controlsData
}
