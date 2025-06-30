"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useLanguage } from "@/lib/language-context"

export default function Page() {
  const { t } = useLanguage()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const deviceName = formData.get("name") as string

    if (!deviceName) {
      toast.error(t.newDevice.deviceNameRequired)
      return
    }

    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: deviceName })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t.newDevice.addDeviceFailed)
      }

      const newDevice = await response.json()
      toast.success(t.newDevice.deviceAddedSuccess)

      // Redirect to the device configuration page
      window.location.href = `/dashboard/devices/${newDevice.deviceId}`
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t.newDevice.unknownError)
      }
    }
  }

  return (
    <div className="grid flex-1 gap-4">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{t.newDevice.title}</CardTitle>
            <CardDescription>
              {t.newDevice.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t.newDevice.deviceNameLabel}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t.newDevice.deviceNamePlaceholder}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">{t.newDevice.addDeviceButton}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 