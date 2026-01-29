"use client";

import Link from "next/link";

export default function PremiumButton({
  href,
  onClick,
  disabled = false,
  type = "button",
  children,
  variant = "primary", // primary | secondary
  className = "",
}) {
  const base =
    "inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-center font-semibold transition " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  const primary =
    "bg-gradient-to-r from-pink-500 via-orange-400 to-cyan-400 text-white " +
    "shadow-[0_0_18px_rgba(255,120,220,0.65)] hover:scale-[1.02] hover:opacity-95";

  const secondary =
    "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50";

  const styles = variant === "primary" ? primary : secondary;

  const cls = `${base} ${styles} ${className}`;

  // ✅ Se for link, renderiza Link
  if (href) {
    return (
      <Link href={href} className={cls} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  // ✅ Se for ação, renderiza button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
    >
      {children}
    </button>
  );
}

