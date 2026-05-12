"use client";

import { useState, useCallback } from "react";

interface ShareButtonsProps {
  /** Title of the item to share (car name or blog post title) */
  title: string;
  /** Full URL to share. If omitted, uses window.location.href */
  url?: string;
}

/* -------------------------------------------------------------------------- */
/*  Inline SVG Icons                                                          */
/* -------------------------------------------------------------------------- */

function WhatsAppShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = useCallback(() => {
    return url ?? (typeof window !== "undefined" ? window.location.href : "");
  }, [url]);

  const shareText = `Check out ${title} on Goudoukh Luxury Cars!`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = getUrl();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [getUrl]);

  const buttons = [
    {
      label: "WhatsApp",
      icon: <WhatsAppShareIcon />,
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${getUrl()}`)}`,
      hoverClass: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
    },
    {
      label: "Facebook",
      icon: <FacebookShareIcon />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
      hoverClass: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    },
    {
      label: "X",
      icon: <XShareIcon />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getUrl())}`,
      hoverClass: "hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a]",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Share this
      </span>

      {buttons.map((btn) => (
        <a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${btn.label}`}
          title={`Share on ${btn.label}`}
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all duration-300 ${btn.hoverClass}`}
        >
          {btn.icon}
        </a>
      ))}

      {/* Copy link button */}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        title={copied ? "Copied!" : "Copy link"}
        className={`flex h-9 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all duration-300 ${
          copied
            ? "border-green-500 bg-green-50 text-green-600"
            : "border-gray-200 text-gray-500 hover:border-[#ff5c00] hover:text-[#ff5c00]"
        }`}
      >
        {copied ? <CheckIcon /> : <LinkIcon />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
