"use client"

import { Button } from "@/components/ui/button"
import { Menu, Moon, Sun, X, Shield } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Contact", href: "/contact" }
  ]

  return (
    <>
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold">VPN Access Portal</span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="text-muted-foreground -m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-muted-foreground text-sm leading-6 font-semibold"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mounted && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="bg-foreground/20 fixed inset-0 z-[60] backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="bg-background sm:ring-border fixed inset-y-0 right-0 z-[70] w-full overflow-y-auto px-6 py-6 shadow-2xl sm:max-w-sm sm:ring-1 lg:hidden">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="-m-1.5 p-1.5 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold">VPN Portal</span>
              </Link>
              <button
                type="button"
                className="text-muted-foreground -m-2.5 rounded-md p-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="divide-border -my-6 divide-y">
                <div className="space-y-2 py-6">
                  {navigation.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-foreground hover:bg-accent hover:text-accent-foreground -mx-3 block rounded-lg px-3 py-2 text-base leading-7 font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="space-y-3 py-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light")
                      setMobileMenuOpen(false)
                    }}
                  >
                    {theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : theme === "light" ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : (
                      <Sun className="mr-2 h-4 w-4" />
                    )}
                    {theme === "dark" ? "Light Mode" : theme === "light" ? "Dark Mode" : "System"}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
