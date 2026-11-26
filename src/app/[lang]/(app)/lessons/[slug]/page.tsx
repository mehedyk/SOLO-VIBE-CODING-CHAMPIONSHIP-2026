import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonLab from "@/components/LessonLab";
import ChapterBanner from "@/components/ChapterBanner";
import { findChapterBySlug } from "@/lib/curriculum/nctb";
import { isLang, LANGS } from "@/lib/i18n/dict";
import { ENGINES } from "@/lib/lessons/engines";
import { LESSONS, findLesson, lessonText } from "@/lib/lessons/registry";

export const dynamicParams = false;
export function generateStaticParams() { return LANGS.flatMap((lang) => LESSONS.map((l) => ({ lang, slug: l.slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const l = findLesson(slug);
  return l && isLang(lang) ? { title: lessonText(l, lang).title } : {};
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang, slug } = await params;
  const lesson = findLesson(slug);
  if (!isLang(lang) || !lesson) notFound();

  const sp = await searchParams;
  const chapterSlug = typeof sp.chapter === "string" ? sp.chapter : undefined;
  const chapter = chapterSlug ? findChapterBySlug(chapterSlug) : undefined;
  let initialNums: [number, number] | undefined;
  if (chapter) {
    const check = ENGINES[lesson.kind].checkInputs(String(chapter.demoNumbers[0]), String(chapter.demoNumbers[1]));
    if (check.ok) initialNums = [check.m, check.s];
  }

  return (
    <>
      {chapter && <ChapterBanner chapter={chapter} lang={lang} />}
      <LessonLab lang={lang} mode="student" slug={slug} initialNums={initialNums} />
    </>
  );
}
