import { useEffect, useState } from "react"
import { getDatabase, onValue, ref } from "firebase/database"
import { app } from "~/lib/firebase/init-firebase"
import type { DeviceData } from "~/types"

export function useGetDeviceData() {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    eco: false,
    lastSeen: 0,
    mode: "-",
    online: false,
    sensorHeight: 0,
  })

  useEffect(() => {
    const db = getDatabase(app)
    const deviceRef = ref(db, "device")

    const unsubscribe = onValue(deviceRef, (snapshot) => {
      const data = snapshot.val() as DeviceData | null

      if (data) {
        setDeviceData((current) => ({ ...current, ...data }))
      }
    })

    return () => unsubscribe()
  }, [])

  return deviceData
}
