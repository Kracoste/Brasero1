'use client';

import { createContext, useContext } from "react";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings-defaults";

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

type Props = {
  value: SiteSettings;
  children: React.ReactNode;
};

export const SiteSettingsProvider = ({ value, children }: Props) => (
  <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
);

export const useSiteSettings = () => useContext(SiteSettingsContext);
