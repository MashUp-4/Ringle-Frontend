import { apiGet } from './api'

export function createPagePreloader(
  read: (path: string) => Promise<unknown> = apiGet,
) {
  async function preloadPageData(pathname: string, search = '') {
    let primary: string | undefined
    if (pathname === '/') {
      void read('/users/me/summary').catch(() => {})
      primary = '/users/me/home'
    } else if (pathname === '/tutors' || pathname.startsWith('/tutors/')) {
      void read('/users/me/class-counts').catch(() => {})
      if (pathname === '/tutors') primary = '/tutors?isFeatured=true'
      // Filtered lists are built by the filter adapter in the page hook.
      else if (pathname !== '/tutors/all' || !search) primary = '/tutors'
    }
    if (primary) await read(primary)
  }

  function preloadInitialData(pathname: string, search: string) {
    void read('/users/me/profile-image').catch(() => {})
    // Prioritize the current page; only warm adjacent pages after its data loads.
    void preloadPageData(pathname, search)
      .then(() => {
        if (pathname !== '/' && !pathname.startsWith('/tutors')) return
        const adjacent =
          pathname === '/'
            ? ['/tutors', '/tutors/all']
            : ['/', ...(pathname === '/tutors' ? ['/tutors/all'] : ['/tutors'])]
        return Promise.all(adjacent.map((path) => preloadPageData(path)))
      })
      .catch(() => {})
  }
  return { preloadPageData, preloadInitialData }
}

export const { preloadPageData, preloadInitialData } = createPagePreloader()
