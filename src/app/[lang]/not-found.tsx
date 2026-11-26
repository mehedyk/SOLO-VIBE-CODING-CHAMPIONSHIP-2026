import ErrorScreen from '@/components/ErrorScreen';

export default function NotFound() {
  // The language is not available here, so show both languages.
  return <ErrorScreen code="404" title="পাতাটি পাওয়া যায়নি · Page not found" body="লিংকটি ভুল বা পাতাটি সরে গেছে। · The link may be wrong or the page has moved." homeHref="/bn" homeLabel="হোম · Home" />;
}
