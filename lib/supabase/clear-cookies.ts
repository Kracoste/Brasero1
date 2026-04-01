import type { NextResponse } from 'next/server';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

/**
 * Supprime tous les cookies de session Supabase (préfixe sb-) sur une réponse.
 */
export function clearSupabaseCookies(
  response: NextResponse,
  cookieStore: ReadonlyRequestCookies,
): void {
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith('sb-')) {
      response.cookies.set(cookie.name, '', {
        expires: new Date(0),
        path: '/',
      });
    }
  });
}
