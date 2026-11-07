const hosts = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);

export function isShortsUrl(value: string, base = 'https://www.youtube.com/'): boolean {
  try {
    const url = new URL(value, base);
    return hosts.has(url.hostname) && /^\/shorts(?:\/|$)/i.test(url.pathname);
  } catch {
    return false;
  }
}

// Target individual cards, never a complete search-results or video-feed container.
export const cardSelector = [
  'ytd-rich-item-renderer', 'ytd-video-renderer', 'ytd-grid-video-renderer',
  'ytd-compact-video-renderer', 'ytd-reel-item-renderer',
  'ytm-shorts-lockup-view-model', 'yt-shorts-lockup-view-model',
  'ytd-guide-entry-renderer', 'ytd-mini-guide-entry-renderer',
  'ytm-video-with-context-renderer', 'ytm-reel-item-renderer'
].join(',');

export function hideShorts(root: ParentNode, base: string): void {
  for (const link of root.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    if (!isShortsUrl(link.getAttribute('href') ?? '', base)) continue;
    const target = link.closest<HTMLElement>(cardSelector) ?? link;
    if (!target.hasAttribute('data-shorts-blocked')) {
      target.setAttribute('data-shorts-blocked', '');
    }
  }
  // YouTube reuses card nodes during navigation; restore cards changed to normal videos.
  for (const target of root.querySelectorAll<HTMLElement>('[data-shorts-blocked]')) {
    const links = target.matches('a[href]') ? [target as HTMLAnchorElement] : target.querySelectorAll<HTMLAnchorElement>('a[href]');
    if (![...links].some(link => isShortsUrl(link.getAttribute('href') ?? '', base))) {
      target.removeAttribute('data-shorts-blocked');
    }
  }
}
