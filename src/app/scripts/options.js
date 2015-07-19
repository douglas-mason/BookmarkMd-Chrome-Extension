(function() {
  'use strict';
  var init, showError;

  this.dbclient = {};

  console.log('Options');

  init = function(config) {
    return this.dbclient = config != null ? config.client : void 0;
  };

  showError = function(error) {
    console.log(error);
    return $('#errorMessage').text(error);
  };

  chrome.runtime.getBackgroundPage(function(backgroundWindow) {
    var client;
    client = backgroundWindow.client;
    this.init({
      'client': client
    });
    if (client.isAuthenticated()) {
      return $('#btnLogout').text('Logout of Dropbox');
    } else {
      return $('#btnLogout').text('Sign into Dropbox');
    }
  });

  $('#btnLogout').click(function() {
    if (this.dbclient.isAuthenticated()) {
      this.dbclient.signOut();
      return $('#btnLogout').text('Sign into Dropbox');
    } else {
      return this.dbclient.authenticate(function(error, client) {
        if (error) {
          return this.showError(error);
        }
        return $('#btnLogout').text('Logout of Dropbox');
      });
    }
  });

}).call(this);
