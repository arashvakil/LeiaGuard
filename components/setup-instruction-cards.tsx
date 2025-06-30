import { Smartphone, Monitor } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

interface Props {
  /** include App Store / Google Play buttons */
  showAppButtons?: boolean;
}

export default function SetupInstructionCards({ showAppButtons = true }: Props) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Mobile Setup */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            {t.deviceConfig.mobileSetupTitle}
          </CardTitle>
          <CardDescription>{t.deviceConfig.mobileSetupDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Store buttons */}
          {showAppButtons && (
            <div className="space-y-3">
              <p className="text-sm font-medium">{t.deviceConfig.step1Download}</p>
              <div className="flex flex-col gap-3">
                <Link
                  href="https://apps.apple.com/us/app/wireguard/id1441195209"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">📱</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.deviceConfig.downloadOnAppStore}</p>
                      <p className="text-lg font-bold">App Store</p>
                    </div>
                  </div>
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.wireguard.android&hl=en_US"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">▶</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.deviceConfig.getOnGooglePlay}</p>
                      <p className="text-lg font-bold">Google Play</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3">
            <p className="text-sm font-medium">{t.deviceConfig.step2Setup}</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              {[1, 2, 3, 4].map((num, idx) => {
                const stepKey = `step${num}` as keyof typeof t.deviceConfig.mobileSteps;
                if (num === 2) {
                  // special block with QR vs file options
                  return (
                    <div key={num} className="ml-1">
                      <div className="flex items-start gap-2">
                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                          2
                        </span>
                        <span className="font-medium text-foreground">{t.deviceConfig.mobileSteps.step2}</span>
                      </div>
                      <div className="ml-7 space-y-2 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border-l-4 border-blue-500">
                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300">🔍 {t.deviceConfig.mobileSteps.step3}</div>
                        <div className="text-sm font-medium text-green-700 dark:text-green-300">📁 {t.deviceConfig.mobileSteps.step4}</div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={num} className="flex items-start gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                      {num === 1 ? 1 : num === 3 ? 3 : 4}
                    </span>
                    <span>{t.deviceConfig.mobileSteps[stepKey]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Setup */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/10 to-transparent"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Monitor className="h-6 w-6 text-orange-600" />
            </div>
            {t.deviceConfig.desktopSetupTitle}
          </CardTitle>
          <CardDescription>{t.deviceConfig.desktopSetupDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showAppButtons && (
            <div className="space-y-3">
              <p className="text-sm font-medium">{t.deviceConfig.step1Download}</p>
              <Link
                href="https://www.wireguard.com/install/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.deviceConfig.downloadFromWireguard}</p>
                    <p className="text-lg font-bold">wireguard.com</p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm font-medium">{t.deviceConfig.step2Setup}</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>{t.deviceConfig.desktopSteps.step1}</li>
              <li>{t.deviceConfig.desktopSteps.step2}</li>
              <li>{t.deviceConfig.desktopSteps.step3}</li>
              <li>{t.deviceConfig.desktopSteps.step4}</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 