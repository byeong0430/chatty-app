const generateRandomId = (alphabet => {
  const alphabetLength = alphabet.length;
  const randoIter = (key, n) => {
    if (n === 0) {
      return key;
    }
    const randoIndex = Math.floor(Math.random() * alphabetLength);
    const randoLetter = alphabet[randoIndex];
    return randoIter(key + randoLetter, n - 1);
  };
  return () => randoIter('', 10);
})('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

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

module.exports = { generateRandomId, addEnterKey };