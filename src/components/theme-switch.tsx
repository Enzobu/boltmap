"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePreference } from "@/components/theme-provider";

const options: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof Sun;
}> = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "system", label: "Système", icon: Laptop },
  { value: "dark", label: "Sombre", icon: Moon },
];

export function ThemeSwitch() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="theme-switch" role="group" aria-label="Thème">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          className="theme-switch__option"
          aria-label={label}
          aria-pressed={preference === value}
          data-active={preference === value || undefined}
          onClick={() => setPreference(value)}
          title={label}
        >
          <Icon aria-hidden="true" size={15} strokeWidth={1.9} />
        </button>
      ))}
    </div>
  );
}
