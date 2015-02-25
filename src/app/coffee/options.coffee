'use strict'
@dbclient = {}

console.log('Options')

init = (config) ->
    @dbclient = config?.client

showError = (error) ->
    console.log(error)
    $('#errorMessage').text(error)

chrome.runtime.getBackgroundPage (backgroundWindow) ->
    client = backgroundWindow.client;
    @init({
      'client': client
    })
    if (client.isAuthenticated())
      $('#btnLogout').text('Logout of Dropbox')
    else
      $('#btnLogout').text('Sign into Dropbox')


$('#btnLogout').click ->
  if (@dbclient.isAuthenticated())
    @dbclient.signOut()
    $('#btnLogout').text('Sign into Dropbox')
  else
    @dbclient.authenticate (error, client) ->
      if(error)
        return @showError error
      $('#btnLogout').text('Logout of Dropbox')
