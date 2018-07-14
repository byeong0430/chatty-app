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

module.exports = { addEnterKey };