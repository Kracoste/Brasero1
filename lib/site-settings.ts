import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  DEFAULT_SITE_SETTINGS,
  STORE_SETTINGS_ID,
  type SiteSettings,
} from '@/lib/site-settings-defaults';

const SETTINGS_FILE = path.join(process.cwd(), 'data', `${STORE_SETTINGS_ID}-settings.json`);

const sanitizeSettings = (input: Record<string, unknown>): SiteSettings => {
  const merged = {
    ...DEFAULT_SITE_SETTINGS,
    ...input,
  } as Record<string, unknown>;

  if (!Array.isArray(merged.schedules)) {
    merged.schedules = DEFAULT_SITE_SETTINGS.schedules;
  }
  merged.atelier = {
    ...DEFAULT_SITE_SETTINGS.atelier,
    ...(typeof merged.atelier === 'object' && merged.atelier ? merged.atelier : {}),
  };

  return merged as SiteSettings;
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return sanitizeSettings(parsed);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
};

export const saveSiteSettings = async (settings: SiteSettings) => {
  const sanitized = sanitizeSettings(settings as Record<string, unknown>);
  await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(sanitized, null, 2), 'utf-8');
};
