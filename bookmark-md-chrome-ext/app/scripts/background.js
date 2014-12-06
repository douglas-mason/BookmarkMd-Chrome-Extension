'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

client.authenticate(function (error, client) {
  if (error) {
    return showError(error);
  }
});

