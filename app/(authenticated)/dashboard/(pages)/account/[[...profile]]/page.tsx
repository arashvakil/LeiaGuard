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
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"

export default function AccountPage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const { t } = useLanguage()

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsChangingPassword(true)
    
    const formData = new FormData(event.currentTarget)
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t.profile.passwordRequired)
      setIsChangingPassword(false)
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error(t.profile.passwordsDoNotMatch)
      setIsChangingPassword(false)
      return
    }

    if (newPassword.length < 8) {
      toast.error(t.profile.passwordTooShort)
      setIsChangingPassword(false)
      return
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t.profile.passwordUpdateFailed)
      }

      toast.success(t.profile.passwordUpdated)
      // Clear form
      ;(event.target as HTMLFormElement).reset()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t.profile.passwordUpdateFailed)
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="grid flex-1 gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.profile.title}</h1>
        <p className="text-muted-foreground mt-2">
          {t.profile.personalInfoDescription}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t.profile.personalInfo}</CardTitle>
            <CardDescription>
              {t.profile.accountSettingsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>{t.auth.username}</Label>
              <Input value={session?.user?.username || ""} disabled />
            </div>
            <div className="grid gap-2">
              <Label>{t.profile.accountSettings}</Label>
              <div className="flex items-center gap-2">
                <Badge variant={session?.user?.isAdmin ? "default" : "secondary"}>
                  {session?.user?.isAdmin ? t.admin.admin : t.admin.user}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t.profile.languageSettings}</CardTitle>
            <CardDescription>
              {t.profile.languageSettingsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label>{t.profile.selectLanguage}</Label>
              <Select defaultValue="en">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t.profile.selectLanguage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t.profile.english}</SelectItem>
                  <SelectItem value="fa">{t.profile.persian}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Theme Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>{t.profile.appearance}</CardTitle>
            <CardDescription>
              {t.profile.appearanceDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="theme">{t.profile.theme}</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t.profile.selectTheme} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">{t.profile.system}</SelectItem>
                  <SelectItem value="light">{t.profile.light}</SelectItem>
                  <SelectItem value="dark">{t.profile.dark}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <form onSubmit={handlePasswordChange}>
            <CardHeader>
              <CardTitle>{t.profile.changePassword}</CardTitle>
              <CardDescription>
                {t.profile.changePasswordDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">{t.profile.currentPassword}</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">{t.profile.newPassword}</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                />
                <p className="text-sm text-muted-foreground">
                  {t.profile.passwordTooShort}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">{t.profile.confirmNewPassword}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? `${t.profile.updatePassword}...` : t.profile.updatePassword}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 