"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV === "development"
    ) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Check for updates periodically (every 60 minutes)
        const interval = setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        return () => clearInterval(interval);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }, []);

  return null;
}
