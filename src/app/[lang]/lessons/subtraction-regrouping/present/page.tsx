import { notFound } from "next/navigation";
import SubtractionLab from "../../../../../components/SubtractionLab";
import { isLang } from "../../../../../lib/i18n/dict";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return <SubtractionLab lang={lang} mode="present" />;
}
