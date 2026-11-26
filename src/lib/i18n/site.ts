/** Copy for the landing page, auth screens, dashboards and chrome. Bangla is the default language. */
export interface Site {
  appName: string;
  nav: { how: string; labs: string; roles: string; curriculum: string; login: string; signup: string; dashboard: string; logout: string; lessons: string; labsApp: string; admin: string; author: string; goHome: string };
  hero: { eyebrow: string; title: string; sub: string; ctaSignup: string; ctaLogin: string; ctaDash: string; fine: string };
  breaker: { title: string; col1: string; col2: string; note0: string; note1: string; btn: string; reset: string };
  how: { kicker: string; title: string; lead: string; beats: { t: string; d: string }[] };
  labs: { kicker: string; title: string; lead: string; open: string; items: { slug: string; href: string; name: string; d: string; cls: string }[] };
  roles: { kicker: string; title: string; lead: string; items: { key: string; name: string; headline: string; points: string[] }[] };
  curr: { kicker: string; title: string; lead: string; chapters: string; cls: string; signIn: string };
  cta: { title: string; sub: string };
  foot: { blurb: string; learn: string; account: string; about: string; honest: string; rights: string; pause: string; play: string };
  scene: { pause: string; play: string };
  auth: {
    loginTitle: string; loginSub: string; signupTitle: string; signupSub: string;
    name: string; email: string; password: string; show: string; hide: string; role: string;
    student: string; studentD: string; teacher: string; teacherD: string;
    loginBtn: string; signupBtn: string; loading: string; noAccount: string; haveAccount: string;
    pitchTitle: string; pitch: string[]; expired: string; demoTitle: string;
    pwHelp: string; strength: string[];
    err: Record<string, string>;
  };
  app: { greet: string; today: string; signedInAs: string; roleName: Record<string, string> };
  dash: {
    studentLead: string; continueTitle: string; continueBody: string; startLab: string;
    score: string; steps: string; attempts: string; avgScore: string; labsTried: string; lastActive: string;
    recent: string; noAttempts: string; suggested: string; step: string;
    teacherLead: string; teacherTools: string; presenter: string; print: string; slides: string; learner: string; lessonsReady: string;
    applyTitle: string; applyBody: string; exp: string; plan: string; submitApp: string; appPending: string; appSent: string;
    authorLead: string; myLessons: string; noLessons: string; status: Record<string, string>; version: string; submitReview: string; newLesson: string; save: string; create: string;
    adminLead: string; tabs: { users: string; apps: string; reports: string; audit: string };
    users: string; role: string; joined: string; state: string; suspend: string; reinstate: string; apps: string; approve: string; reject: string; noPending: string;
    reports: string; quarantine: string; dismiss: string; noReports: string; audit: string; when: string; action: string; actor: string; result: string; allowed: string; denied: string;
    total: string; pendingApps: string; openReports: string; lessonsLive: string; reason: string; done: string; failed: string;
  };
}

const en: Site = {
  appName: 'Primary Visual Lab',
  nav: { how: 'How it works', labs: 'Labs', roles: 'Who it’s for', curriculum: 'Curriculum', login: 'Log in', signup: 'Sign up', dashboard: 'Dashboard', logout: 'Sign out', lessons: 'Lessons', labsApp: 'Visual labs', admin: 'Admin console', author: 'My lessons', goHome: 'Home' },
  hero: {
    eyebrow: 'Primary maths · Classes 1–5',
    title: 'See why the numbers change.',
    sub: 'Break a ten into ones, cut a fraction in half, jump along a number line. Every rule of primary maths, shown with blocks you can touch, for teachers on a projector and children on their own.',
    ctaSignup: 'Create a free account', ctaLogin: 'Log in', ctaDash: 'Open my dashboard',
    fine: 'Free to use. Bangla and English. Works on a phone.',
  },
  breaker: { title: 'Try it: 52 − 27', col1: 'Tens', col2: 'Ones', note0: '2 ones can’t take away 7. What now?', note1: 'Break one ten into 10 ones. The total is still 52: 4 tens and 12 ones.', btn: 'Break a ten', reset: 'Reset' },
  how: {
    kicker: 'How a lesson works', title: 'One idea at a time, always visible', lead: 'Every lab follows the same four beats, so children learn the pattern as well as the answer.',
    beats: [
      { t: 'Choose numbers', d: 'Pick your own numbers or use the suggested ones.' },
      { t: 'Predict', d: 'Before each step, guess what happens next.' },
      { t: 'Watch it change', d: 'Blocks move, regroup and total up on screen.' },
      { t: 'Read the method', d: 'The written working appears beside the picture.' },
    ],
  },
  labs: {
    kicker: 'Visual labs', title: 'Seven tools, one picture of maths', lead: 'Concrete, then pictorial, then abstract. Open any lab after you sign in.', open: 'Open',
    items: [
      { slug: 'base10', href: '/lessons/subtraction-regrouping', name: 'Base-10 blocks & exchange', d: 'Trade 10 ones for 1 ten and back, with the total always visible.', cls: 'Class 2–3' },
      { slug: 'fractions', href: '/manipulatives/fractions', name: 'Fraction bars', d: 'Cut and line up bars to see why 1/2 = 2/4.', cls: 'Class 3–4' },
      { slug: 'numberline', href: '/manipulatives/numberline', name: 'Number line jumps', d: 'Jump forward and back to add and subtract.', cls: 'Class 1–3' },
      { slug: 'counting', href: '/manipulatives/counting', name: 'Dot counter', d: 'Pair, count and compare with movable tokens.', cls: 'Class 1' },
      { slug: 'multiplication', href: '/manipulatives/multiplication', name: 'Multiplication array', d: 'Rows × columns as an area you can count.', cls: 'Class 2–3' },
      { slug: 'decimals', href: '/manipulatives/decimals', name: 'Decimals grid', d: '100 squares that turn decimals into percentages.', cls: 'Class 4–5' },
      { slug: 'geometry', href: '/manipulatives/geometry', name: 'Geoboard shapes', d: 'Stretch bands around pegs to build shapes.', cls: 'Class 3–5' },
    ],
  },
  roles: {
    kicker: 'Who it’s for', title: 'A place for every role', lead: 'Sign up as a student or a teacher. Authors and reviewers join by application.',
    items: [
      { key: 'student', name: 'Students', headline: 'Practise at your own pace', points: ['Try every lab as often as you like', 'Your attempts and scores are saved', 'Bangla or English digits, your choice'] },
      { key: 'teacher', name: 'Teachers', headline: 'Teach straight from the screen', points: ['Classroom mode with large controls', 'Printable worksheets for each lesson', 'Offline slide decks for weak connections'] },
      { key: 'author', name: 'Lesson authors', headline: 'Write lessons the community can use', points: ['Apply from your dashboard, an admin reviews it', 'Every edit is a numbered, hashed version', 'Submit drafts for peer review'] },
      { key: 'admin', name: 'Administrators', headline: 'Keep the library trustworthy', points: ['Approve author applications', 'Quarantine reported lessons', 'Full audit log of every sensitive action'] },
    ],
  },
  curr: { kicker: 'Curriculum', title: 'Mapped to the primary maths topics', lead: 'Chapters follow the NCTB topic structure for Classes 1 to 5. This is a learning aid, not an official NCTB product.', chapters: 'chapters', cls: 'Class', signIn: 'Sign in to browse' },
  cta: { title: 'Ready to see it for yourself?', sub: 'It takes less than a minute to start.' },
  foot: { blurb: 'A visual maths laboratory for primary school. Built for the Hack the Vibe 2026 solo championship.', learn: 'Learn', account: 'Account', about: 'About', honest: 'Demonstration content. Lessons are not yet reviewed against a specific textbook edition, and this is not an official NCTB product.', rights: 'Primary Visual Lab', pause: 'Pause video', play: 'Play video' },
  scene: { pause: 'Pause background video', play: 'Play background video' },
  auth: {
    loginTitle: 'Welcome back', loginSub: 'Log in to continue your lessons.', signupTitle: 'Create your account', signupSub: 'Free, and it only takes a minute.',
    name: 'Full name', email: 'Email', password: 'Password', show: 'Show', hide: 'Hide', role: 'I am a…',
    student: 'Student', studentD: 'Learn with the labs', teacher: 'Teacher', teacherD: 'Teach in class',
    loginBtn: 'Log in', signupBtn: 'Create account', loading: 'Please wait…', noAccount: 'New here?', haveAccount: 'Already have an account?',
    pitchTitle: 'Maths you can see.',
    pitch: ['Break a ten into ones and watch the total stay the same', 'Prove 1/2 = 2/4 by cutting bars', 'Present in class or practise at home'],
    expired: 'Your session ended. Please log in again.', demoTitle: 'Judges: try a role without a password',
    pwHelp: 'At least 8 characters, mixing letters and numbers.', strength: ['Too weak', 'Weak', 'Good', 'Strong'],
    err: {
      INVALID_CREDENTIALS: 'That email and password don’t match.', TOO_MANY_ATTEMPTS: 'Too many tries. Wait a few minutes and try again.', USER_SUSPENDED: 'This account has been suspended.',
      USER_ALREADY_EXISTS: 'An account with this email already exists. Try logging in.', INVALID_INPUT: 'Please check the highlighted fields.',
      TOO_SHORT: 'Use at least 8 characters.', TOO_COMMON: 'That password is too common.', SAME_AS_EMAIL: 'The password can’t be your email.', NEEDS_VARIETY: 'Mix letters with numbers or symbols.', TOO_LONG: 'That password is too long.',
      DATABASE_NOT_CONFIGURED: 'The database isn’t configured yet. The site owner needs to set MONGODB_URI.', DATABASE_UNAVAILABLE: 'Can’t reach the database right now. Try again shortly.',
      SERVER_ERROR: 'Something went wrong on our side. Please try again.', NETWORK: 'No connection. Check your internet and try again.', CROSS_SITE_REQUEST_BLOCKED: 'Request blocked. Reload the page and try again.',
    },
  },
  app: { greet: 'Hello, {name}', today: 'Today', signedInAs: 'Signed in as', roleName: { student: 'Student', teacher: 'Teacher', contributor: 'Lesson author', reviewer: 'Reviewer', admin: 'Administrator', guest: 'Guest' } },
  dash: {
    studentLead: 'Pick up where you left off, or try a new lab.', continueTitle: 'Continue learning', continueBody: 'Open a lab and your attempts will appear here.', startLab: 'Open a lab',
    score: 'Score', steps: 'Steps', attempts: 'Attempts', avgScore: 'Average score', labsTried: 'Lessons tried', lastActive: 'Last active',
    recent: 'Recent attempts', noAttempts: 'No attempts yet. Finish a lesson and it will show up here.', suggested: 'Try next', step: 'steps',
    teacherLead: 'Everything you need to teach a lesson, in one place.', teacherTools: 'Classroom tools', presenter: 'Classroom mode', print: 'Printable sheet', slides: 'Offline slides', learner: 'Learner view', lessonsReady: 'Interactive lessons ready to teach',
    applyTitle: 'Become a lesson author', applyBody: 'Authors write lessons that every learner can use. An administrator reviews each application.', exp: 'Your teaching experience', plan: 'Describe a sample lesson plan', submitApp: 'Send application', appPending: 'Your application is under review.', appSent: 'Application sent. An administrator will review it.',
    authorLead: 'Write, version and submit lessons for review.', myLessons: 'My lessons', noLessons: 'You haven’t written any lessons yet.', status: { draft: 'Draft', under_review: 'Under review', published: 'Published', quarantined: 'Quarantined' }, version: 'Version', submitReview: 'Submit for review', newLesson: 'New lesson', save: 'Save', create: 'Create draft',
    adminLead: 'People, applications, reports and the audit trail.', tabs: { users: 'People', apps: 'Applications', reports: 'Reports', audit: 'Audit log' },
    users: 'People', role: 'Role', joined: 'Joined', state: 'Status', suspend: 'Suspend', reinstate: 'Reinstate', apps: 'Author applications', approve: 'Approve', reject: 'Reject', noPending: 'No applications waiting.',
    reports: 'Reported lessons', quarantine: 'Quarantine', dismiss: 'Dismiss', noReports: 'No open reports.', audit: 'Recent activity', when: 'When', action: 'Action', actor: 'Who', result: 'Result', allowed: 'Allowed', denied: 'Denied',
    total: 'People', pendingApps: 'Applications waiting', openReports: 'Open reports', lessonsLive: 'Lessons in the library', reason: 'Reason', done: 'Done', failed: 'That didn’t work. Try again.',
  },
};

const bn: Site = {
  appName: 'প্রাইমারি ভিজ্যুয়াল ল্যাব',
  nav: { how: 'কীভাবে কাজ করে', labs: 'ল্যাব', roles: 'কাদের জন্য', curriculum: 'শিক্ষাক্রম', login: 'লগইন', signup: 'সাইন আপ', dashboard: 'ড্যাশবোর্ড', logout: 'বের হন', lessons: 'পাঠসমূহ', labsApp: 'ভিজ্যুয়াল ল্যাব', admin: 'অ্যাডমিন কনসোল', author: 'আমার পাঠ', goHome: 'হোম' },
  hero: {
    eyebrow: 'প্রাথমিক গণিত · ১ম–৫ম শ্রেণি',
    title: 'সংখ্যা কেন বদলায়, চোখে দেখুন।',
    sub: 'একটি দশককে ভেঙে এককে নিন, ভগ্নাংশকে আধা করুন, সংখ্যারেখায় লাফ দিন। প্রাথমিক গণিতের প্রতিটি নিয়ম ব্লক দিয়ে দেখানো হয়, যাতে শিক্ষক প্রজেক্টরে পড়াতে পারেন আর শিশু নিজে নিজে শিখতে পারে।',
    ctaSignup: 'বিনামূল্যে অ্যাকাউন্ট খুলুন', ctaLogin: 'লগইন', ctaDash: 'আমার ড্যাশবোর্ড',
    fine: 'বিনামূল্যে। বাংলা ও ইংরেজি। ফোনেও চলে।',
  },
  breaker: { title: 'নিজে করে দেখুন: ৫২ − ২৭', col1: 'দশক', col2: 'একক', note0: '২টি একক থেকে ৭ বাদ দেওয়া যায় না। এখন কী করব?', note1: 'একটি দশককে ১০টি এককে ভাঙুন। মোট এখনও ৫২: ৪টি দশক ও ১২টি একক।', btn: 'একটি দশক ভাঙুন', reset: 'আবার শুরু' },
  how: {
    kicker: 'পাঠ কীভাবে চলে', title: 'একবারে একটি ধারণা, সবসময় চোখের সামনে', lead: 'প্রতিটি ল্যাব একই চারটি ধাপে চলে, তাই শিশু শুধু উত্তর নয়, নিয়মটাও শেখে।',
    beats: [
      { t: 'সংখ্যা বাছুন', d: 'নিজের সংখ্যা দিন, অথবা প্রস্তাবিত সংখ্যা নিন।' },
      { t: 'আগে অনুমান করুন', d: 'প্রতিটি ধাপের আগে ভাবুন, এরপর কী হবে।' },
      { t: 'বদলাতে দেখুন', d: 'ব্লক সরে, ভেঙে ও যোগ হয়ে পর্দায় দেখা যায়।' },
      { t: 'হিসাবটা পড়ুন', d: 'ছবির পাশে লেখা হিসাব ফুটে ওঠে।' },
    ],
  },
  labs: {
    kicker: 'ভিজ্যুয়াল ল্যাব', title: 'সাতটি টুল, গণিতের একটি ছবি', lead: 'আগে হাতে-কলমে, তারপর ছবিতে, শেষে প্রতীকে। সাইন ইন করে যেকোনো ল্যাব খুলুন।', open: 'খুলুন',
    items: [
      { slug: 'base10', href: '/lessons/subtraction-regrouping', name: 'বেস-১০ ব্লক ও বিনিময়', d: '১০টি এককের বদলে ১টি দশক নিন, আবার ভেঙে দিন। মোট মান সবসময় দেখা যায়।', cls: '২য়–৩য় শ্রেণি' },
      { slug: 'fractions', href: '/manipulatives/fractions', name: 'ভগ্নাংশ বার', d: 'বার কেটে মিলিয়ে দেখুন কেন ১/২ = ২/৪।', cls: '৩য়–৪র্থ শ্রেণি' },
      { slug: 'numberline', href: '/manipulatives/numberline', name: 'সংখ্যারেখায় লাফ', d: 'সামনে-পিছনে লাফ দিয়ে যোগ-বিয়োগ করুন।', cls: '১ম–৩য় শ্রেণি' },
      { slug: 'counting', href: '/manipulatives/counting', name: 'ডট কাউন্টার', d: 'সরানো যায় এমন টোকেনে জোড়া মেলান, গুনুন ও তুলনা করুন।', cls: '১ম শ্রেণি' },
      { slug: 'multiplication', href: '/manipulatives/multiplication', name: 'গুণের অ্যারে', d: 'সারি × কলাম এক টুকরো ক্ষেত্রফল হয়ে ধরা দেয়।', cls: '২য়–৩য় শ্রেণি' },
      { slug: 'decimals', href: '/manipulatives/decimals', name: 'দশমিক গ্রিড', d: '১০০টি ঘর, যা দশমিককে শতকরায় বদলে দেয়।', cls: '৪র্থ–৫ম শ্রেণি' },
      { slug: 'geometry', href: '/manipulatives/geometry', name: 'জিওবোর্ডে আকৃতি', d: 'পেগে রাবার টেনে আকৃতি বানান।', cls: '৩য়–৫ম শ্রেণি' },
    ],
  },
  roles: {
    kicker: 'কাদের জন্য', title: 'প্রত্যেকের জন্য একটি জায়গা', lead: 'শিক্ষার্থী বা শিক্ষক হিসেবে সাইন আপ করুন। লেখক ও পর্যালোচক আবেদনের মাধ্যমে যুক্ত হন।',
    items: [
      { key: 'student', name: 'শিক্ষার্থী', headline: 'নিজের গতিতে অনুশীলন করুন', points: ['যতবার খুশি যেকোনো ল্যাব চেষ্টা করুন', 'আপনার চেষ্টা ও স্কোর জমা থাকে', 'বাংলা বা ইংরেজি অঙ্ক, আপনার পছন্দ'] },
      { key: 'teacher', name: 'শিক্ষক', headline: 'সরাসরি পর্দা থেকে পড়ান', points: ['বড় বোতামের শ্রেণিকক্ষ মোড', 'প্রতিটি পাঠের ছাপার উপযোগী শিট', 'দুর্বল নেটওয়ার্কের জন্য অফলাইন স্লাইড'] },
      { key: 'author', name: 'পাঠ লেখক', headline: 'সবার কাজে লাগে এমন পাঠ লিখুন', points: ['ড্যাশবোর্ড থেকে আবেদন করুন, অ্যাডমিন যাচাই করবেন', 'প্রতিটি সম্পাদনা নম্বরযুক্ত ও হ্যাশ করা সংস্করণ', 'পর্যালোচনার জন্য খসড়া জমা দিন'] },
      { key: 'admin', name: 'অ্যাডমিনিস্ট্রেটর', headline: 'লাইব্রেরি নির্ভরযোগ্য রাখুন', points: ['লেখকের আবেদন অনুমোদন করুন', 'রিপোর্ট হওয়া পাঠ কোয়ারেন্টাইন করুন', 'প্রতিটি সংবেদনশীল কাজের সম্পূর্ণ অডিট লগ'] },
    ],
  },
  curr: { kicker: 'শিক্ষাক্রম', title: 'প্রাথমিক গণিতের বিষয় অনুযায়ী সাজানো', lead: 'অধ্যায়গুলো ১ম থেকে ৫ম শ্রেণির NCTB বিষয়কাঠামো অনুসরণ করে। এটি একটি শেখার সহায়ক, NCTB-র আনুষ্ঠানিক পণ্য নয়।', chapters: 'টি অধ্যায়', cls: 'শ্রেণি', signIn: 'দেখতে সাইন ইন করুন' },
  cta: { title: 'নিজের চোখে দেখতে প্রস্তুত?', sub: 'শুরু করতে এক মিনিটও লাগে না।' },
  foot: { blurb: 'প্রাথমিক বিদ্যালয়ের জন্য একটি ভিজ্যুয়াল গণিত ল্যাবরেটরি। Hack the Vibe 2026 সলো চ্যাম্পিয়নশিপের জন্য তৈরি।', learn: 'শিখুন', account: 'অ্যাকাউন্ট', about: 'সম্পর্কে', honest: 'ডেমো বিষয়বস্তু। পাঠগুলো এখনো কোনো নির্দিষ্ট পাঠ্যবইয়ের সংস্করণের সঙ্গে মেলানো হয়নি, এবং এটি NCTB-র আনুষ্ঠানিক পণ্য নয়।', rights: 'প্রাইমারি ভিজ্যুয়াল ল্যাব', pause: 'ভিডিও থামান', play: 'ভিডিও চালান' },
  scene: { pause: 'ব্যাকগ্রাউন্ড ভিডিও থামান', play: 'ব্যাকগ্রাউন্ড ভিডিও চালান' },
  auth: {
    loginTitle: 'আবার স্বাগতম', loginSub: 'পাঠ চালিয়ে যেতে লগইন করুন।', signupTitle: 'অ্যাকাউন্ট খুলুন', signupSub: 'বিনামূল্যে, এক মিনিটেই হয়ে যায়।',
    name: 'পুরো নাম', email: 'ইমেইল', password: 'পাসওয়ার্ড', show: 'দেখান', hide: 'লুকান', role: 'আমি একজন…',
    student: 'শিক্ষার্থী', studentD: 'ল্যাব দিয়ে শিখব', teacher: 'শিক্ষক', teacherD: 'ক্লাসে পড়াব',
    loginBtn: 'লগইন', signupBtn: 'অ্যাকাউন্ট খুলুন', loading: 'অপেক্ষা করুন…', noAccount: 'নতুন এসেছেন?', haveAccount: 'আগেই অ্যাকাউন্ট আছে?',
    pitchTitle: 'চোখে দেখা গণিত।',
    pitch: ['দশককে এককে ভাঙুন, আর দেখুন মোট মান একই থাকে', 'বার কেটে প্রমাণ করুন ১/২ = ২/৪', 'ক্লাসে উপস্থাপন করুন বা বাড়িতে অনুশীলন করুন'],
    expired: 'আপনার সেশন শেষ হয়েছে। আবার লগইন করুন।', demoTitle: 'বিচারকদের জন্য: পাসওয়ার্ড ছাড়াই একটি ভূমিকা দেখুন',
    pwHelp: 'কমপক্ষে ৮ অক্ষর, অক্ষর ও সংখ্যা মিশিয়ে।', strength: ['খুব দুর্বল', 'দুর্বল', 'ভালো', 'শক্তিশালী'],
    err: {
      INVALID_CREDENTIALS: 'ইমেইল ও পাসওয়ার্ড মিলছে না।', TOO_MANY_ATTEMPTS: 'অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।', USER_SUSPENDED: 'এই অ্যাকাউন্টটি স্থগিত করা হয়েছে।',
      USER_ALREADY_EXISTS: 'এই ইমেইলে আগেই অ্যাকাউন্ট আছে। লগইন করে দেখুন।', INVALID_INPUT: 'চিহ্নিত ঘরগুলো ঠিক করুন।',
      TOO_SHORT: 'কমপক্ষে ৮ অক্ষর দিন।', TOO_COMMON: 'এই পাসওয়ার্ডটি খুব পরিচিত।', SAME_AS_EMAIL: 'পাসওয়ার্ড ইমেইলের মতো হতে পারবে না।', NEEDS_VARIETY: 'অক্ষরের সঙ্গে সংখ্যা বা চিহ্ন মেশান।', TOO_LONG: 'পাসওয়ার্ডটি খুব বড়।',
      DATABASE_NOT_CONFIGURED: 'ডাটাবেস এখনো সেট করা হয়নি। সাইটের মালিককে MONGODB_URI দিতে হবে।', DATABASE_UNAVAILABLE: 'এখন ডাটাবেসে পৌঁছানো যাচ্ছে না। একটু পরে চেষ্টা করুন।',
      SERVER_ERROR: 'আমাদের দিকে কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।', NETWORK: 'সংযোগ নেই। ইন্টারনেট দেখে আবার চেষ্টা করুন।', CROSS_SITE_REQUEST_BLOCKED: 'অনুরোধ আটকে গেছে। পাতা রিলোড করে আবার চেষ্টা করুন।',
    },
  },
  app: { greet: 'হ্যালো, {name}', today: 'আজ', signedInAs: 'সাইন ইন করা আছে', roleName: { student: 'শিক্ষার্থী', teacher: 'শিক্ষক', contributor: 'পাঠ লেখক', reviewer: 'পর্যালোচক', admin: 'অ্যাডমিনিস্ট্রেটর', guest: 'অতিথি' } },
  dash: {
    studentLead: 'যেখানে থেমেছিলেন সেখান থেকে শুরু করুন, বা নতুন ল্যাব চেষ্টা করুন।', continueTitle: 'শেখা চালিয়ে যান', continueBody: 'একটি ল্যাব খুলুন, আপনার চেষ্টাগুলো এখানে দেখা যাবে।', startLab: 'একটি ল্যাব খুলুন',
    score: 'স্কোর', steps: 'ধাপ', attempts: 'চেষ্টা', avgScore: 'গড় স্কোর', labsTried: 'চেষ্টা করা পাঠ', lastActive: 'সর্বশেষ সক্রিয়',
    recent: 'সাম্প্রতিক চেষ্টা', noAttempts: 'এখনো কোনো চেষ্টা নেই। একটি পাঠ শেষ করলে এখানে দেখা যাবে।', suggested: 'এরপর চেষ্টা করুন', step: 'ধাপ',
    teacherLead: 'পাঠ পড়াতে যা যা লাগে, এক জায়গায়।', teacherTools: 'শ্রেণিকক্ষের টুল', presenter: 'শ্রেণিকক্ষ মোড', print: 'ছাপার শিট', slides: 'অফলাইন স্লাইড', learner: 'শিক্ষার্থীর ভিউ', lessonsReady: 'পড়ানোর জন্য প্রস্তুত ইন্টারঅ্যাকটিভ পাঠ',
    applyTitle: 'পাঠ লেখক হন', applyBody: 'লেখকরা এমন পাঠ লেখেন যা সব শিক্ষার্থী ব্যবহার করতে পারে। প্রতিটি আবেদন একজন অ্যাডমিন যাচাই করেন।', exp: 'আপনার শিক্ষকতার অভিজ্ঞতা', plan: 'একটি নমুনা পাঠ পরিকল্পনা লিখুন', submitApp: 'আবেদন পাঠান', appPending: 'আপনার আবেদন যাচাই চলছে।', appSent: 'আবেদন পাঠানো হয়েছে। একজন অ্যাডমিন যাচাই করবেন।',
    authorLead: 'পাঠ লিখুন, সংস্করণ রাখুন ও পর্যালোচনার জন্য জমা দিন।', myLessons: 'আমার পাঠ', noLessons: 'আপনি এখনো কোনো পাঠ লেখেননি।', status: { draft: 'খসড়া', under_review: 'পর্যালোচনাধীন', published: 'প্রকাশিত', quarantined: 'কোয়ারেন্টাইনে' }, version: 'সংস্করণ', submitReview: 'পর্যালোচনায় পাঠান', newLesson: 'নতুন পাঠ', save: 'সংরক্ষণ', create: 'খসড়া তৈরি করুন',
    adminLead: 'মানুষ, আবেদন, রিপোর্ট ও অডিট ট্রেইল।', tabs: { users: 'ব্যবহারকারী', apps: 'আবেদন', reports: 'রিপোর্ট', audit: 'অডিট লগ' },
    users: 'ব্যবহারকারী', role: 'ভূমিকা', joined: 'যোগ দিয়েছেন', state: 'অবস্থা', suspend: 'স্থগিত করুন', reinstate: 'পুনরায় চালু', apps: 'লেখক হওয়ার আবেদন', approve: 'অনুমোদন', reject: 'বাতিল', noPending: 'কোনো আবেদন অপেক্ষায় নেই।',
    reports: 'রিপোর্ট করা পাঠ', quarantine: 'কোয়ারেন্টাইন', dismiss: 'খারিজ', noReports: 'কোনো খোলা রিপোর্ট নেই।', audit: 'সাম্প্রতিক কার্যকলাপ', when: 'কখন', action: 'কাজ', actor: 'কে', result: 'ফল', allowed: 'অনুমোদিত', denied: 'প্রত্যাখ্যাত',
    total: 'ব্যবহারকারী', pendingApps: 'অপেক্ষমাণ আবেদন', openReports: 'খোলা রিপোর্ট', lessonsLive: 'লাইব্রেরির পাঠ', reason: 'কারণ', done: 'হয়েছে', failed: 'কাজটি হয়নি। আবার চেষ্টা করুন।',
  },
};

export const site: Record<'bn' | 'en', Site> = { bn, en };
