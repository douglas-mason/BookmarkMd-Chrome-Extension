  'use strict';
  var client = new Dropbox.Client({ key: app.dropboxKey });
  client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
    receiverPath: "/chrome_oauth_receiver.html"}));
