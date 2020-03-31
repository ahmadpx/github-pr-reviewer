import { ALL_FILES_VALUE, FILES_PATTERNS_CACHE_KEY } from './constants';

/**
 * get patterns from cache
 * @return {Array<{active: Boolean, value: String}>}
 */
export function patternsFromCache() {
  let cachedPatterns = localStorage.getItem(FILES_PATTERNS_CACHE_KEY);

  try {
    cachedPatterns = JSON.parse(cachedPatterns) || [];
  } catch (e) {
    cachedPatterns = [];
  }

  return cachedPatterns;
}

/**
 * update cache with files patterns
 * @param {Array<{active: Boolean, value: String}>} patterns
 */
export function updateCacheWithPatterns(patterns) {
  localStorage.setItem(
    FILES_PATTERNS_CACHE_KEY,
    JSON.stringify(
      patterns.filter((pattern) => pattern.value !== ALL_FILES_VALUE)
    )
  );
}

/**
 * send current tab message [contentScript]
 * @param msg
 * @param cb
 */
export function sendCurrentTabMessage(msg, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg, cb);
  });
}
