import '@fontsource-variable/lexend';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource/noto-sans-bengali/400.css';
import '@/styles/tokens.css';
import '@/styles/base.css';
import ErrorScreen from '@/components/ErrorScreen';

export default function RootNotFound() {
  return (
    <html lang="bn">
      <body style={{ background: 'linear-gradient(160deg,#10304f,#0b1826)' }}>
        <ErrorScreen code="404" title="পাতাটি পাওয়া যায়নি · Page not found" body="লিংকটি ভুল বা পাতাটি সরে গেছে। · The link may be wrong or the page has moved." homeHref="/bn" homeLabel="হোম · Home" />
      </body>
    </html>
  );
}
