'use client';

import ErrorScreen from '@/components/ErrorScreen';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const db = /DATABASE_(NOT_CONFIGURED|UNAVAILABLE)/.test(error.message);
  return (
    <ErrorScreen
      code={db ? 'DB' : '500'}
      title={db ? 'ডাটাবেস সংযোগ নেই · Database not connected' : 'কিছু একটা ভুল হয়েছে · Something went wrong'}
      body={db ? 'MONGODB_URI সেট করুন এবং আবার চেষ্টা করুন। · Set MONGODB_URI in your environment variables, then try again.' : 'আবার চেষ্টা করুন। · Please try again.'}
      homeHref="/bn" homeLabel="হোম · Home"
    >
      <button type="button" className="btn btn-amber" onClick={() => reset()}>Retry</button>
    </ErrorScreen>
  );
}
