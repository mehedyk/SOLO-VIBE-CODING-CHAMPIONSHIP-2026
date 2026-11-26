import { Lang } from './dict';
import { formatInt } from '../math/numerals';

const BN_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BN_DAYS = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const EN_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface FormattedDate {
  dateStr: string;
  banglaYearStr: string;
  termNotice: string;
}

export function getAcademicDate(lang: Lang, now = new Date()): FormattedDate {
  const isBn = lang === 'bn';
  const dayIndex = now.getDay();
  const dayNum = now.getDate();
  const monthIndex = now.getMonth();
  const year = now.getFullYear();

  if (isBn) {
    const dayName = BN_DAYS[dayIndex];
    const monthName = BN_MONTHS[monthIndex];
    const dayBn = formatInt(dayNum, 'bn');
    const yearBn = formatInt(year, 'bn');
    const banglaYear = formatInt(monthIndex > 3 || (monthIndex === 3 && dayNum >= 14) ? year - 593 : year - 594, 'bn');

    return {
      dateStr: `${dayName}, ${dayBn} ${monthName} ${yearBn}`,
      banglaYearStr: `${banglaYear} বঙ্গাব্দ`,
      termNotice: `২০২৬ শিক্ষাবর্ষ · ১ম–৫ম শ্রেণি জাতীয় শিক্ষাক্রম (NCTB) অনুমোদিত ল্যাব`,
    };
  }

  const dayName = EN_DAYS[dayIndex];
  const monthName = EN_MONTHS[monthIndex];
  return {
    dateStr: `${dayName}, ${monthName} ${dayNum}, ${year}`,
    banglaYearStr: `1433 Bangabda`,
    termNotice: `Academic Session ${year} · NCTB Aligned Visual Mathematics`,
  };
}
