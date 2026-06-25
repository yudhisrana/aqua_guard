import { useEffect, useState } from "react"
import { getDatabase, onValue, ref } from "firebase/database"
import { app } from "~/lib/firebase/init-firebase"
import type { SettingsData } from "~/types"

const defaultConfig: SettingsData = {
  config: {
    adaptive: {
      alertReadInterval: 0,
      alertReportInterval: 0,
      lowPowerReadInterval: 0,
      lowPowerReportInterval: 0,
      monitoringReadInterval: 0,
      monitoringReportInterval: 0,
    },
    beepInterval: 0,
    buzzerOverride: "AUTO",
    fixed: {
      readInterval: 0,
      reportInterval: 0,
    },
    lcdOverride: "AUTO",
    mode: "AUTO",
    reset: {
      requested: false,
      type: "none",
    },
    safeThreshold: 0,
    updatedAt: 0,
    warningThreshold: 0,
  },
}

export function useGetSettingsData() {
  const [settingsData, setSettingsData] = useState<SettingsData>(defaultConfig)

  useEffect(() => {
    const db = getDatabase(app)
    const configRef = ref(db, "devices/aquaguard-01")

    const unsubscribe = onValue(configRef, (snapshot) => {
      const data = snapshot.val() as SettingsData | null

      if (data) {
        setSettingsData((current) => ({ ...current, ...data }))
      }
    })

    return () => unsubscribe()
  }, [])

  return settingsData
}
