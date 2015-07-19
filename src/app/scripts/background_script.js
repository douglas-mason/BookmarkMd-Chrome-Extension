(function() {
  'use strict';
  var client;

  chrome.runtime.onInstalled.addListener(function(details) {
    return console.log('previousVersion', details.previousVersion);
  });

  client = new Dropbox.Client({
    key: 'wde9f9j8u65zbce'
  });

  client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
    receiverPath: "/chrome_oauth_receiver.html"
  }));

  client.authenticate(function(error, client) {
    if (error) {
      return showError(error);
    }
  });

}).call(this);
