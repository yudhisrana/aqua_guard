import { useEffect, useState } from "react"
import { getDatabase, onValue, ref } from "firebase/database"
import { app } from "~/lib/firebase/init-firebase"
import type { DeviceData } from "~/types"

export function useGetDeviceData() {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    status: {
      activityState: "-",
      batteryPercent: 0,
      buzzerOn: false,
      buzzerOverride: "-",
      distance: 0,
      floodStatus: "-",
      lastSeenAt: 0,
      lcdOn: false,
      lcdOverride: "-",
      mode: "-",
      rainDetected: false,
      rainIntensity: "-",
      readInterval: 0,
      reportInterval: 0,
      waterLevel: 0,
    },
  })

  useEffect(() => {
    const db = getDatabase(app)
    const deviceRef = ref(db, "devices/aquaguard-01")

    const unsubscribe = onValue(deviceRef, (snapshot) => {
      const data = snapshot.val() as DeviceData | null

      if (data) {
        setDeviceData((current) => ({ ...current, ...data }))
        console.log("Device data updated:", data)
      }
    })

    return () => unsubscribe()
  }, [])

  return deviceData
}
