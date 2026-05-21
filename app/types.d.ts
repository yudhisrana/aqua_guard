export type DeviceData = {
  eco?: boolean
  lastSeen?: number
  mode?: string
  online?: boolean
  sensorHeight?: number
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
