export interface GuestProgressRecord {
  lessonSlug: string;
  completedSteps: number;
  totalSteps: number;
  score: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'primary_visual_lab_guest_progress';
const GUEST_ID_KEY = 'primary_visual_lab_guest_id';

export function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return 'guest_server_default';
  try {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id = 'guest_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    return id;
  } catch {
    return 'guest_memory';
  }
}

export function getLocalProgress(): Record<string, GuestProgressRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalProgress(lessonSlug: string, progress: Omit<GuestProgressRecord, 'lessonSlug' | 'lastUpdated'>): void {
  if (typeof window === 'undefined') return;
  try {
    const records = getLocalProgress();
    records[lessonSlug] = {
      ...progress,
      lessonSlug,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('Could not save local guest progress:', e);
  }
}
