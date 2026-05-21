import { useEffect, useState } from "react"
import { getDatabase, onValue, ref } from "firebase/database"
import { app } from "~/lib/firebase/init-firebase"
import type { SettingsData } from "~/types"

export function useGetSettingsData() {
  const [settingsData, setSettingsData] = useState<SettingsData>({
    activeInterval: 0,
    ecoInterval: 0,
    readInterval: 0,
    safeThreshold: 0,
    warningThreshold: 0,
  })

  useEffect(() => {
    const db = getDatabase(app)
    const deviceRef = ref(db, "settings")

    const unsubscribe = onValue(deviceRef, (snapshot) => {
      const data = snapshot.val() as SettingsData | null

      if (data) {
        setSettingsData((current) => ({ ...current, ...data }))
      }
    })

    return () => unsubscribe()
  }, [])

  return settingsData
}
