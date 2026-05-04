"use client";

import { ReactNode } from "react";
import { SettingsProvider } from "./SettingsProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>;
}
