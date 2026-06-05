export type DeviceData = {
  config?: SettingsData["config"]
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
    sensorHeight?: number
    waterLevel?: number
  }
}

export type ControlsData = {
  buzzer?: boolean
  forceRefresh?: boolean
}

export type SettingsData = {
  config?: {
    adaptive?: {
      alertReadInterval?: number
      alertReportInterval?: number
      lowPowerReadInterval?: number
      lowPowerReportInterval?: number
      monitoringReadInterval?: number
      monitoringReportInterval?: number
    }
    beepInterval?: number
    buzzerOverride?: string
    fixed?: {
      readInterval?: number
      reportInterval?: number
    }
    lcdOverride?: string
    mode?: string
    reset?: {
      requested?: boolean
      type?: string
    }
    safeThreshold?: number
    updatedAt?: number
    warningThreshold?: number
  }
}
