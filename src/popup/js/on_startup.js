// What's this do?: This sets the min and max for the slider input. As well as
//                  sending a message as soon as the extension is opened up.
//                  If a value is already set on the client side. It will use
//                  those values instead of the ones set here (extension side).

// Set min and max for slider input
speedRangeInputElem.min = MIN_SPEED;
speedRangeInputElem.max = MAX_SPEED;

// Send message to content_scripts when extension is opened up
sendMessage({
  ...videoSpeedObj((isSet = false)),
  ...checkboxValObj((isSet = false)),
})
  .then((response) => {
    console.log('Response from content script:', response);

    // If a videospeed is already set on the client side, use speed on extension
    // side instead
    if (response.speed) {
      const videoSpeed = response.speed;
      speedRangeInputElem.value = videoSpeed;
      speedTextInputElem.value = `${videoSpeed}x`;
    } else {
      const videoSpeed = LS_videoSpeed();
      speedRangeInputElem.value = videoSpeed;
      speedTextInputElem.value = `${videoSpeed}x`;
    }

    // If a checkbox value is already set on the client side, use speed on
    // extension side instead
    if (response.checkboxValue !== null) {
      checkboxElem.checked = response.checkboxValue;
    } else {
      checkboxElem.checked = LS_checkboxValue();
    }
  })
  .catch((error) => {
    console.error('Error sending message:', error);
  });
