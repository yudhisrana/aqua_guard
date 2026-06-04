export type DeviceData = {
  status?: {
    activityState?: string
    batteryPercent?: number
    buzzerOn?: boolean
    buzzerOverride?: string
    distance?: number
    floodStatus?: string
    lastSeenAt?: number
    lcdOn?: boolean
    lcdOverride?: string
    mode?: string
    rainDetected?: boolean
    rainIntensity?: string
    readInterval?: number
    reportInterval?: number
    waterLevel?: number
  }
}

export type ControlsData = {
  buzzer?: boolean
  forceRefresh?: boolean
}

export type SettingsData = {
  activeInterval?: number
  ecoInterval?: number
  readInterval?: number
  safeThreshold?: number
  warningThreshold?: number
}
