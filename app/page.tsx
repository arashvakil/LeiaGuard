"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Lock } from "lucide-react";
import Link from "next/link";
import { useLanguage, LanguageSwitcher } from "@/lib/language-context";

export default function HomePage() {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Language Switcher */}
      <div className={`absolute top-6 z-10 ${isRTL ? 'left-6' : 'right-6'}`}>
        <LanguageSwitcher />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t.marketing.heroTitle}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {t.marketing.heroDescription}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Lock className="h-8 w-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">{t.marketing.secureAccess}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                {t.marketing.secureAccessDescription}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Users className="h-8 w-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">{t.marketing.invitationOnly}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                {t.marketing.invitationOnlyDescription}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Shield className="h-8 w-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">{t.marketing.multiDevice}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                {t.marketing.multiDeviceDescription}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className={`space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/login">{t.nav.login}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link href="/register">{t.marketing.registerWithCode}</Link>
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            {t.marketing.needInvitationCode}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            {t.marketing.privateVPNService}
          </p>
        </div>
      </div>
    </div>
  );
} 