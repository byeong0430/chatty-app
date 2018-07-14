const addEnterKey = (element, submitBtnId) => {
  // submit the form when enter key is detected on input[name="message"]
  const messageInput = document.querySelector(element);
  // add an event listener to detect `enter`
  messageInput.addEventListener('keyup', function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      document.getElementById(submitBtnId).click();
    }
  })
};

const autoScrollToBottom = query => {
  const messages = document.querySelector(query);
  messages.scrollTo(0, messages.scrollHeight);
};

module.exports = { addEnterKey, autoScrollToBottom };