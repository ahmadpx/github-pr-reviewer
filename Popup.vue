<template>
  <div class="wrapper">
    <form @sumbmit="addPattern" class="createPattern__form">
      <input
        type="text"
        placeholder="Add a file pattern"
        v-model.trim="filePatternInput"
        class="createPattern__input"
      />
      <button @click="addPattern" class="createPattern__button">
        Add
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
import {
  patternsFromCache,
  sendCurrentTabMessage,
  updateCacheWithPatterns,
} from './popup.utils';
import { ALL_FILES_VALUE } from './constants';

export default {
  data() {
    return {
      filePatternInput: '',
      filesPatterns: [
        { value: ALL_FILES_VALUE, active: false },
        ...patternsFromCache(),
      ],
    };
  },
  computed: {
    activeFilesPatterns() {
      return this.filesPatterns.filter(({ active }) => active);
    },
    allFilesPattern() {
      return (
        this.filesPatterns.find(
          (pattern) => pattern.value === ALL_FILES_VALUE,
        ) || { active: false }
      );
    },
  },
  methods: {
    markFiles(asViewed) {
      const { active: markAll } = this.allFilesPattern;
      sendCurrentTabMessage({
        filesPatterns: this.activeFilesPatterns,
        markAll,
        asViewed,
      });
    },
    addPattern() {
      if (!this.filePatternInput) return;
      this.filesPatterns.push({ value: this.filePatternInput, active: true });
      this.filePatternInput = '';
    },
    removeFilePattern({ value }) {
      this.filesPatterns = this.filesPatterns.filter(
        (pattern) => pattern.value !== value,
      );
    },
  },
  updated() {
    updateCacheWithPatterns(this.filesPatterns);
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 250px;
}

.createPattern {
  &__form {
    display: flex;
    margin-bottom: 20px;
  }

  &__input {
    line-height: 30px;
    height: 30px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    padding: 0 8px;
    flex: 1;
  }

  &__button {
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
}

.patterns {
  &__wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  &__title {
    font-size: 14px;
    margin-bottom: 10px;
  }
}

.pattern {
  display: flex;
  margin-bottom: 3px;
  width: 50%;
  cursor: pointer;

  &__label {
    align-items: center;
  }

  &__removeButton {
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

    &:focus {
      outline: 0;
      border: 0;
    }
  }
}

.actions {
  display: flex;
  margin-top: 20px;

  &__button {
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

    &--markAsViewed {
      background: coral;
      border: 1px solid coral;
    }

    &--markAsUnViewed {
      background: honeydew;
      border: 1px solid coral;
      color: coral;
      margin-left: 5px;
    }
  }
}
</style>
