'use strict';
var _dbclient = {};

console.log('Options');

function init(config) {
    config = config || {};
    _dbclient = config.client;
}

function showError(error) {
    console.log(error);
    $('#errorMessage').text(error);
}

chrome.runtime.getBackgroundPage(function (backgroundWindow) {
    var client = backgroundWindow.client;
    init({
      'client': client
    });
    if (client.isAuthenticated()) {
      $('#btnLogout').text('Logout of Dropbox');
    }
    else{
      $('#btnLogout').text('Sign into Dropbox');
    }
});


$('#btnLogout').click(function(){
  if (_dbclient.isAuthenticated()) {
    _dbclient.signOut();
      $('#btnLogout').text('Sign into Dropbox');
  }
  else{
    _dbclient.authenticate(function(error, client){
      if(error){
        return showError(error);
      }
      $('#btnLogout').text('Logout of Dropbox');
    });
  }
});
