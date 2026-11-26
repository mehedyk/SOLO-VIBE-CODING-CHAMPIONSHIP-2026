import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonLab from "@/components/LessonLab";
import { isLang, LANGS } from "@/lib/i18n/dict";
import { LESSONS, findLesson, lessonText } from "@/lib/lessons/registry";

export const dynamicParams = false;
export function generateStaticParams() { return LANGS.flatMap((lang) => LESSONS.map((l) => ({ lang, slug: l.slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const l = findLesson(slug);
  return l && isLang(lang) ? { title: lessonText(l, lang).title } : {};
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLang(lang) || !findLesson(slug)) notFound();
  return <LessonLab lang={lang} mode="present" slug={slug} />;
}
