import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { hideShorts, isShortsUrl } from '../src/blocker';

test('Shorts URL detection respects hostname and path boundaries', () => {
  for (const url of ['/shorts', '/shorts/abc?feature=share', 'https://m.youtube.com/shorts/abc']) assert.equal(isShortsUrl(url), true);
  for (const url of ['/watch?v=abc', '/shortstory', 'https://youtube.com.evil.test/shorts/a', 'https://example.com/shorts/a', '/results?search_query=shorts']) assert.equal(isShortsUrl(url), false);
});

test('hides only Shorts cards, preserves adjacent normal videos, handles new cards', () => {
  const document = new JSDOM(`<main><ytd-video-renderer id="short"><a href="/shorts/a">Short</a></ytd-video-renderer><ytd-video-renderer id="normal"><a href="/watch?v=b">Video</a></ytd-video-renderer></main>`).window.document;
  hideShorts(document, 'https://www.youtube.com/');
  assert.equal(document.querySelector('#short')!.hasAttribute('data-shorts-blocked'), true);
  assert.equal(document.querySelector('#normal')!.hasAttribute('data-shorts-blocked'), false);
  assert.equal(document.querySelector('main')!.hasAttribute('data-shorts-blocked'), false);
  document.querySelector('main')!.insertAdjacentHTML('beforeend', '<a id="new" href="/shorts/b">New</a>');
  hideShorts(document, 'https://www.youtube.com/');
  assert.equal(document.querySelector('#new')!.hasAttribute('data-shorts-blocked'), true);
  document.querySelector('#short a')!.setAttribute('href', '/watch?v=a');
  hideShorts(document, 'https://www.youtube.com/');
  assert.equal(document.querySelector('#short')!.hasAttribute('data-shorts-blocked'), false);
});
