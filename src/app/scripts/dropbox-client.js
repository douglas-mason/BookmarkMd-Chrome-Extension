(function() {
  var client;

  client = new Dropbox.Client({
    key: 'wde9f9j8u65zbce'
  });

  client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
    receiverPath: "/chrome_oauth_receiver.html"
  }));

}).call(this);
