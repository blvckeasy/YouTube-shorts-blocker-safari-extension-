import { hideShorts, isShortsUrl } from './blocker';

function redirect(): boolean {
  if (!isShortsUrl(location.href)) return false;
  // Replace avoids a Back-button loop through the blocked URL.
  location.replace(`${location.origin}/`);
  return true;
}

let scheduled = false;
function refresh(): void {
  if (redirect() || scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    hideShorts(document, location.href);
  });
}

if (!redirect()) {
  new MutationObserver(refresh).observe(document, {
    childList: true, subtree: true, attributes: true, attributeFilter: ['href']
  });
  for (const event of ['yt-navigate-start', 'yt-navigate-finish', 'yt-page-data-updated', 'popstate', 'pageshow']) {
    window.addEventListener(event, refresh);
  }
  // Covers History API navigation that does not emit a YouTube event.
  window.setInterval(() => { redirect(); }, 500);
  document.addEventListener('click', event => {
    const anchor = event.composedPath().find(node => node instanceof HTMLAnchorElement);
    if (anchor instanceof HTMLAnchorElement && isShortsUrl(anchor.href)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  refresh();
}
