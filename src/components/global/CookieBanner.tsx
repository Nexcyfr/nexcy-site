"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "nexcy-consent";

/**
 * Bannière cookies minimaliste (Master Brief §23).
 * Concerne uniquement le cookie fonctionnel Cloudflare Turnstile.
 * Plausible ne pose pas de cookie de tracking → pas de consentement requis.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = document.cookie.includes(`${CONSENT_KEY}=`);
    if (!consent) setVisible(true);
  }, []);

  const decide = (value: "accept" | "decline") => {
    // 365 jours
    document.cookie = `${CONSENT_KEY}=${value}; path=/; max-age=31536000; SameSite=Lax`;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-border bg-surface/95 backdrop-blur-md"
    >
      <div className="container-site flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-text-secondary">
          NEXCY utilise des cookies fonctionnels pour protéger son formulaire de
          contact contre les robots.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("decline")}
            className="min-h-[44px] rounded-btn border border-border px-5 py-2 text-sm font-medium text-text-primary transition-colors hover:border-text-primary"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => decide("accept")}
            className="min-h-[44px] rounded-btn bg-accent px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-light"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
