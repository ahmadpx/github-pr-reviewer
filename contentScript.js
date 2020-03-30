onMessage(function({ filesPatterns, markAll, asViewed }, sender, sendResponse) {
  reviewPRFiles({ filesPatterns, markAll, asViewed });
  sendResponse({ done: true });
});

function reviewPRFiles({ filesPatterns, markAll, asViewed }) {
  if(markAll) {
    document.querySelectorAll(`.js-reviewed-checkbox`).forEach(input => check(input, asViewed))
  } else {
    filesPatterns.forEach(pattern => {
      Array.from(document.querySelectorAll(`.js-file-header[data-path]`))
          .filter(el => el.getAttribute('data-path').toLowerCase().includes(pattern.value.toLowerCase()))
          .forEach(el => el.querySelectorAll(`.js-reviewed-checkbox`).forEach(input => check(input, asViewed)));
    })
  }
}

function check(input, asViewed) {
  return asViewed ? !input.checked && input.click() : input.checked && input.click()
}

function onMessage(cb) {
  chrome.runtime.onMessage.addListener(cb);
}
