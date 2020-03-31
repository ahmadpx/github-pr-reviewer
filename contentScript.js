/**
 * main
 */
onMessage(function (
  { filesPatterns, markAll, asViewed },
  sender,
  sendResponse,
) {
  reviewPRFiles({ filesPatterns, markAll, asViewed });
  sendResponse({ done: true });
});

/**
 * mark files as reviewed or un-reviewed
 * @param {Array<{active: Boolean, value: String}>} filesPatterns
 * @param {Boolean} markAll
 * @param {Boolean} asViewed
 */
function reviewPRFiles({ filesPatterns, markAll, asViewed }) {
  if (markAll) {
    document
      .querySelectorAll(`.js-reviewed-checkbox`)
      .forEach((input) => check(input, asViewed));
  } else {
    filesPatterns.forEach((pattern) => {
      Array.from(document.querySelectorAll(`.js-file-header[data-path]`))
        .filter((el) =>
          el
            .getAttribute('data-path')
            .toLowerCase()
            .includes(pattern.value.toLowerCase()),
        )
        .forEach((el) =>
          el
            .querySelectorAll(`.js-reviewed-checkbox`)
            .forEach((input) => check(input, asViewed)),
        );
    });
  }
}

/**
 * check / un-check files
 * @param {HTMLInputElement} input
 * @param {Boolean} asViewed
 */
function check(input, asViewed) {
  asViewed ? !input.checked && input.click() : input.checked && input.click();
}

/**
 * listening on messages
 * @param cb
 */
function onMessage(cb) {
  chrome.runtime.onMessage.addListener(cb);
}
