"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "../lib/i18n/dict";
import { dict } from "../lib/i18n/dict";

export default function LangSwitch({ lang }: { lang: Lang }) {
  const path = usePathname() ?? `/${lang}`;
  const other: Lang = lang === "bn" ? "en" : "bn";
  const href = path.replace(/^\/(bn|en)(?=\/|$)/, `/${other}`);
  return (
    <Link href={href} lang={other} className="lang-switch" aria-label={dict[lang].switchLangLabel} hrefLang={other}>
      {dict[lang].switchLang}
    </Link>
  );
}
