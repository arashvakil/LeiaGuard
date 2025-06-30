"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { Download, QrCode } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import SetupInstructionCards from "@/components/setup-instruction-cards"

interface Device {
  id: string
  deviceName: string
  ipAddress: string
  isActive: boolean
  createdAt: string
}

export default function DeviceConfigPage({ params }: { params: Promise<{ deviceId: string }> }) {
  const [device, setDevice] = useState<Device | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [deviceId, setDeviceId] = useState<string>("")
  const { t } = useLanguage()

  useEffect(() => {
    params.then(({ deviceId }) => {
      setDeviceId(deviceId)
      fetchDeviceAndQR(deviceId)
    })
  }, [params])

  const fetchDeviceAndQR = async (deviceId: string) => {
    try {
      // Fetch device details
      const deviceResponse = await fetch(`/api/devices/${deviceId}`)
      if (!deviceResponse.ok) {
        throw new Error("Failed to fetch device")
      }
      const deviceData = await deviceResponse.json()
      setDevice(deviceData)

      // Fetch QR code
      const qrResponse = await fetch(`/api/devices/${deviceId}/qr`)
      if (!qrResponse.ok) {
        throw new Error("Failed to fetch QR code")
      }
      const qrData = await qrResponse.json()
      setQrCodeUrl(qrData.qrCode)
    } catch (error) {
      console.error("Error fetching device data:", error)
      toast.error(t.deviceConfig.failedToLoadConfig)
    } finally {
      setLoading(false)
    }
  }

  const downloadConfig = () => {
    window.open(`/api/devices/${deviceId}/config`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t.common.loadingConfiguration}</p>
        </div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t.common.deviceNotFound}</h2>
          <p className="text-muted-foreground mb-4">{t.common.deviceNotFoundDescription}</p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            {t.common.backToDashboard}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid flex-1 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.deviceConfig.title}</h1>
          <p className="text-muted-foreground">
            {t.deviceConfig.setupInstructions} "{device.deviceName}"
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/dashboard'}
        >
          {t.common.backToDashboard}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Code */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              {t.deviceConfig.scanQR}
            </CardTitle>
            <CardDescription>
              {t.deviceConfig.scanQRDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {qrCodeUrl ? (
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <Image 
                  src={qrCodeUrl} 
                  alt="WireGuard QR Code" 
                  width={256} 
                  height={256}
                  className="rounded"
                />
              </div>
            ) : (
              <div className="w-64 h-64 bg-muted flex items-center justify-center rounded-lg">
                <p>{t.deviceConfig.loadingQRCode}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Download Config */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-secondary/10 to-transparent"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {t.deviceConfig.downloadConfig}
            </CardTitle>
            <CardDescription>
              {t.deviceConfig.downloadConfigDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{t.deviceConfig.deviceName}:</span>
                <span className="text-sm">{device.deviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">{t.deviceConfig.ipAddress}:</span>
                <span className="text-sm font-mono">{device.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">{t.deviceConfig.status}:</span>
                <span className={`text-sm font-medium ${device.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {device.isActive ? t.dashboard.active : t.dashboard.inactive}
                </span>
              </div>
            </div>
            
            <Button onClick={downloadConfig} className="w-full" size="lg">
              <Download className="h-4 w-4 mr-2" />
              {t.deviceConfig.downloadConfFile}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <SetupInstructionCards />

      {/* Security Notice */}
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <span className="text-lg">🔒</span>
            {t.deviceConfig.securityNoticeTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-700 dark:text-amber-300 text-sm">
            {t.deviceConfig.securityNoticeDescription}
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 