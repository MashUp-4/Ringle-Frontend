import { apiGet } from './api'

// Start only requests needed for the entry page, before React mounts.
// Hooks reuse the same in-flight requests/cache; no extra health polling.
export function preloadInitialData(pathname: string, search: string) {
  void apiGet('/users/me/profile-image').catch(() => {})
  if (pathname === '/') {
    void apiGet('/users/me/summary').catch(() => {})
    void apiGet('/users/me/home').catch(() => {})
  } else if (pathname.startsWith('/tutors')) {
    void apiGet('/users/me/class-counts').catch(() => {})
    if (pathname === '/tutors') {
      void apiGet('/tutors?isFeatured=true').catch(() => {})
    } else if (!search || pathname !== '/tutors/all') {
      void apiGet('/tutors').catch(() => {})
    }
  }
}
