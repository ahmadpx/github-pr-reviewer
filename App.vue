<template>
  <div class="wrapper">
    <form @sumbmit="createPattern" class="createPattern__form">
      <input
        type="text"
        placeholder="Add a file pattern"
        v-model.trim="filePatternInput"
        class="createPattern__input"
      />
      <button @click="createPattern" class="createPattern__button">
        Create
      </button>
    </form>

    <h3 class="patterns__title">Patterns</h3>
    <div class="patterns__wrapper">
      <div class="pattern" v-for="(filePattern, index) in filesPatterns">
        <label class="pattern__label">
          <input type="checkbox" v-model="filePattern.active" />
          {{ filePattern.value }}
        </label>
        <button
          v-if="index > 0"
          class="pattern__removeButton"
          @click="removeFilePattern(filePattern)"
          title="remove file pattern"
        >
          x
        </button>
      </div>
    </div>

    <div class="actions">
      <button
        class="actions__button actions__button--markAsViewed"
        @click="markFiles(true)"
      >
        Mark as viewed
      </button>
      <button
        class="actions__button actions__button--markAsUnViewed"
        @click="markFiles(false)"
      >
        Mark as un viewed
      </button>
    </div>
  </div>
</template>

<script>
const ALL_FILES_VALUE = 'All files';
const FILES_PATTERNS_CACHE_KEY = 'GithubReviewed__cachedPatterns';

export default {
  data() {
    return {
      filePatternInput: '',
      filesPatterns: [
        { value: ALL_FILES_VALUE, active: false },
        ...patternsFromCache()
      ]
    };
  },
  methods: {
    createPattern() {
      if (!this.filePatternInput) return;
      this.filesPatterns.push({ value: this.filePatternInput, active: true });
      this.filePatternInput = '';
    },
    markFiles(asViewed) {
      const { active: markAll } = this.filesPatterns.find(
        (pattern) => pattern.value === ALL_FILES_VALUE
      ) || { active: false };
      sendCurrentTabMessage({
        filesPatterns: this.filesPatterns.filter(({ active }) => active),
        markAll,
        asViewed
      });
    },
    removeFilePattern({ value }) {
      this.filesPatterns = this.filesPatterns.filter(
        (pattern) => pattern.value !== value
      );
    }
  },
  updated() {
    updateCacheWithPatterns(this.filesPatterns);
  }
};

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
function sendCurrentTabMessage(msg, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg, cb);
  });
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 250px;
}

.createPattern__form {
  display: flex;
  margin-bottom: 20px;
}

.createPattern__input {
  line-height: 30px;
  height: 30px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 0 8px;
  flex: 1;
}

.createPattern__button {
  height: 30px;
  padding: 0 8px;
  background: coral;
  color: white;
  outline: 0;
  border: 1px solid coral;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  margin-left: 5px;
  cursor: pointer;
}

.patterns__title {
  font-size: 14px;
  margin-bottom: 10px;
}

.patterns__wrapper {
  display: flex;
  flex-wrap: wrap;
}

.pattern {
  display: flex;
  margin-bottom: 3px;
  width: 50%;
  cursor: pointer;
}

.pattern__label {
  align-items: center;
}

.pattern__removeButton {
  color: #802d12;
  background: white;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  line-height: 0;
  height: 18px;
  width: 18px;
  min-width: 18px;
  padding: 0;
  cursor: pointer;
  margin: 0 0 0 5px;
  font-weight: bold;
}

.pattern__removeButton:focus {
  outline: 0;
  border: 0;
}

.actions {
  display: flex;
  margin-top: 20px;
}

.actions__button {
  height: 30px;
  padding: 0 4px;
  color: white;
  outline: 0;
  background: coral;
  border: 1px solid coral;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.actions__button--markAsViewed {
  background: coral;
  border: 1px solid coral;
}

.actions__button--markAsUnViewed {
  background: honeydew;
  border: 1px solid coral;
  color: coral;
  margin-left: 5px;
}
</style>
