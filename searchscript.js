document.addEventListener("contextmenu", notifyBackgroundPage);

function handleResponse(message) {
  console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

function notifyBackgroundPage(e) {
  var sending = browser.runtime.sendMessage({
    greeting: document.getSelection().toString()
  });
  sending.then(handleResponse, handleError);  
}

