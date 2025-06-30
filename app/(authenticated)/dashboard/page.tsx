"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { Plus, Download, QrCode, Trash2, Users } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import SetupInstructionCards from "@/components/setup-instruction-cards"

interface Device {
  id: string
  deviceName: string
  ipAddress: string
  isActive: boolean
  createdAt: string
}

export default function Page() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await fetch("/api/devices")
      if (!response.ok) {
        throw new Error("Failed to fetch devices")
      }
      const data = await response.json()
      setDevices(data)
    } catch (error) {
      console.error("Error fetching devices:", error)
      toast.error(t.dashboard.failedToLoadDevices)
    } finally {
      setLoading(false)
    }
  }

  const downloadConfig = (deviceId: string, deviceName: string) => {
    window.open(`/api/devices/${deviceId}/config`, '_blank')
    toast.success(`${t.dashboard.downloadConfigSuccess}`)
  }

  const viewQRCode = (deviceId: string) => {
    window.location.href = `/dashboard/devices/${deviceId}`
  }

  const deleteDevice = async (deviceId: string, deviceName: string) => {
    if (!confirm(`${t.common.confirmDelete} "${deviceName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to delete device")
      }

      toast.success(t.dashboard.deleteDeviceSuccess)
      fetchDevices() // Refresh the list
    } catch (error) {
      console.error("Error deleting device:", error)
      toast.error(t.dashboard.failedToDeleteDevice)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
          <p className="text-muted-foreground mt-2">
            {t.dashboard.subtitle}
          </p>
        </div>
        <Link href="/dashboard/devices/new">
          <Button size="lg" className="shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            {t.dashboard.addDevice}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Devices Overview */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/5 to-transparent"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t.dashboard.yourVPNDevices}
            </CardTitle>
            <CardDescription>
              {t.dashboard.yourVPNDevicesDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your devices...</p>
                </div>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t.dashboard.noDevices}</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t.dashboard.noDevicesSubtitle}
                  </p>
                </div>
                <Link href="/dashboard/devices/new">
                  <Button size="lg" className="shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    {t.dashboard.addFirstDevice}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden md:block rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50">
                        <TableHead className="font-semibold">{t.dashboard.deviceName}</TableHead>
                        <TableHead className="font-semibold">{t.dashboard.ipAddress}</TableHead>
                        <TableHead className="font-semibold">{t.dashboard.status}</TableHead>
                        <TableHead className="font-semibold">{t.dashboard.created}</TableHead>
                        <TableHead className="text-right font-semibold">{t.dashboard.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {devices.map((device) => (
                        <TableRow key={device.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              {device.deviceName}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm bg-muted/30 rounded px-2 py-1 w-fit">
                            {device.ipAddress}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={device.isActive ? "default" : "secondary"}
                              className={device.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                              {device.isActive ? t.dashboard.active : t.dashboard.inactive}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(device.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewQRCode(device.id)}
                                title={t.dashboard.viewQR}
                                className="hover:bg-blue-50 hover:border-blue-200"
                              >
                                <QrCode className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadConfig(device.id, device.deviceName)}
                                title={t.dashboard.downloadConfig}
                                className="hover:bg-green-50 hover:border-green-200"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteDevice(device.id, device.deviceName)}
                                title={t.dashboard.deleteDevice}
                                className="text-destructive hover:text-destructive hover:bg-red-50 hover:border-red-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {devices.map((device) => (
                    <Card key={device.id} className="relative overflow-hidden">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Header with device name and status */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                              <h3 className="font-semibold text-lg truncate">{device.deviceName}</h3>
                            </div>
                            <Badge 
                              variant={device.isActive ? "default" : "secondary"}
                              className={device.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                              {device.isActive ? t.dashboard.active : t.dashboard.inactive}
                            </Badge>
                          </div>

                          {/* IP Address and Created Date */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{t.dashboard.ipAddress}:</span>
                              <span className="font-mono bg-muted/50 rounded px-2 py-1">
                                {device.ipAddress}
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {new Date(device.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewQRCode(device.id)}
                              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                            >
                              <QrCode className="h-4 w-4" />
                              <span className="hidden xs:inline">QR Code</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadConfig(device.id, device.deviceName)}
                              className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200"
                            >
                              <Download className="h-4 w-4" />
                              <span className="hidden xs:inline">Download</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteDevice(device.id, device.deviceName)}
                              className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-red-50 hover:border-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden xs:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Setup Guide */}
        {devices.length > 0 && (
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg">🚀</span>
                {t.dashboard.quickSetupGuide}
              </CardTitle>
              <CardDescription>
                {t.dashboard.quickSetupSubtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SetupInstructionCards showAppButtons={false} />
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        {devices.length > 0 && (
          <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <span className="text-lg">🔐</span>
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                Your VPN configurations are encrypted and secure. Keep your configuration files private and don't share them with untrusted parties. 
                Each device has a unique configuration for maximum security.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
