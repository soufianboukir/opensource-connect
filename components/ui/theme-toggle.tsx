"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-8 h-8 focus:outline-none flex items-center justify-center"
      type="button"
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 cursor-pointer" />
      ) : (
        <Moon className="w-6 h-6 cursor-pointer" />
      )}
    </button>
  );
}