const ALL_FILES_VALUE = 'All files';
const FILES_PATTERNS_CACHE_KEY = 'GithubReviewed__cachedPatterns';

document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    el: '#app',
    data: {
      filePatternInput: '',
      filesPatterns: [
        { value: ALL_FILES_VALUE, active: false },
        ...patternsFromCache()
      ]
    },
    methods: {
      createPattern() {
        if(!this.filePatternInput) return;
        this.filesPatterns.push({ value: this.filePatternInput, active: true });
        this.filePatternInput = '';
      },
      markFiles(asViewed) {
        const { active: markAll } = this.filesPatterns.find(pattern => pattern.value === ALL_FILES_VALUE) || { active: false };
        sendCurrentTabMessage({ filesPatterns: this.filesPatterns.filter(({ active }) => active), markAll, asViewed });
      },
      removeFilePattern({ value }) {
        this.filesPatterns = this.filesPatterns.filter(pattern => pattern.value !== value);
      }
    },
    updated() {
      updateCacheWithPatterns(this.filesPatterns);
    }
  });
});

/**
 * get patterns from cache
 * @return {Array<{active: Boolean, value: String}>}
 */
function patternsFromCache() {
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
function updateCacheWithPatterns(patterns) {
  localStorage.setItem(FILES_PATTERNS_CACHE_KEY, JSON.stringify(patterns.filter(pattern => pattern.value !== ALL_FILES_VALUE)));
}

/**
 * send current tab message [contentScript]
 * @param msg
 * @param cb
 */
function sendCurrentTabMessage(msg, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg, cb);
  });
}

