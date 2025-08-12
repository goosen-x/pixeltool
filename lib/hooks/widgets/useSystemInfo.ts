import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { detectSystemInfo, detectDevice, type SystemInfo, type DeviceInfo } from '@/lib/data/system-info-data'

interface UseSystemInfoOptions {
  translations?: {
    copied: string
    copyError: string
    refreshed: string
  }
}

export function useSystemInfo(options: UseSystemInfoOptions = {}) {
  const { translations } = options
  
  const [mounted, setMounted] = useState(false)
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  // Initialize component and detect system info
  useEffect(() => {
    setMounted(true)
    detectAndSetSystemInfo()
  }, [])

  const detectAndSetSystemInfo = useCallback(() => {
    const info = detectSystemInfo()
    if (!info) return

    const device = detectDevice(info)
    setSystemInfo(info)
    setDeviceInfo(device)
  }, [])

  // Copy text to clipboard
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(label)
      toast.success(translations?.copied?.replace('{item}', label) || `${label} copied to clipboard!`)
      
      // Clear copied state after 2 seconds
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (error) {
      toast.error(translations?.copyError || 'Failed to copy text')
    }
  }, [translations])

  // Refresh system information
  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    
    // Add a small delay for user feedback
    await new Promise(resolve => setTimeout(resolve, 500))
    
    detectAndSetSystemInfo()
    setIsRefreshing(false)
    toast.success(translations?.refreshed || 'System information refreshed')
  }, [detectAndSetSystemInfo, translations])

  // Reset copied state
  const clearCopiedState = useCallback(() => {
    setCopiedItem(null)
  }, [])

  // Get browser security info
  const getSecurityInfo = useCallback(() => {
    if (!systemInfo) return null

    return {
      isSecure: systemInfo.protocol === 'https:',
      doNotTrack: systemInfo.doNotTrack,
      webdriver: systemInfo.webdriver,
      cookieEnabled: systemInfo.cookieEnabled
    }
  }, [systemInfo])

  // Get display capabilities
  const getDisplayCapabilities = useCallback(() => {
    if (!systemInfo || !deviceInfo) return null

    return {
      isRetina: deviceInfo.isRetina,
      colorDepth: systemInfo.colorDepth,
      pixelRatio: systemInfo.devicePixelRatio,
      orientation: systemInfo.orientation,
      touchSupport: systemInfo.touchSupport,
      maxTouchPoints: systemInfo.maxTouchPoints
    }
  }, [systemInfo, deviceInfo])

  // Get storage capabilities
  const getStorageCapabilities = useCallback(() => {
    if (!systemInfo) return null

    return {
      cookies: systemInfo.cookieEnabled,
      localStorage: systemInfo.localStorage,
      sessionStorage: systemInfo.sessionStorage,
      indexedDB: systemInfo.indexedDB
    }
  }, [systemInfo])

  // Get network info
  const getNetworkInfo = useCallback(() => {
    if (!systemInfo) return null

    return {
      online: systemInfo.onlineStatus,
      hostname: systemInfo.hostname,
      protocol: systemInfo.protocol,
      port: systemInfo.port,
      timezone: systemInfo.timezone
    }
  }, [systemInfo])

  // Get device type for responsive logic
  const getDeviceType = useCallback(() => {
    return deviceInfo?.type || 'unknown'
  }, [deviceInfo])

  // Check if device is mobile
  const isMobile = useCallback(() => {
    return deviceInfo?.type === 'mobile'
  }, [deviceInfo])

  // Check if device is tablet
  const isTablet = useCallback(() => {
    return deviceInfo?.type === 'tablet'
  }, [deviceInfo])

  // Check if device is desktop
  const isDesktop = useCallback(() => {
    return deviceInfo?.type === 'desktop'
  }, [deviceInfo])

  // Get formatted device name
  const getDeviceName = useCallback(() => {
    if (!deviceInfo) return 'Unknown Device'
    
    if (deviceInfo.brand && deviceInfo.model) {
      return `${deviceInfo.brand} ${deviceInfo.model}`
    }
    
    return `${deviceInfo.os} ${deviceInfo.type}`
  }, [deviceInfo])

  return {
    // State
    mounted,
    systemInfo,
    deviceInfo,
    activeTab,
    isRefreshing,
    copiedItem,

    // Actions
    setActiveTab,
    copyToClipboard,
    refresh,
    clearCopiedState,
    detectAndSetSystemInfo,

    // Computed values
    getSecurityInfo,
    getDisplayCapabilities,
    getStorageCapabilities,
    getNetworkInfo,
    getDeviceType,
    getDeviceName,

    // Helper functions
    isMobile,
    isTablet,
    isDesktop
  }
}