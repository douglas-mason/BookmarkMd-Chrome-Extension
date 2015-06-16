'use strict'

chrome.runtime.onInstalled.addListener (details) ->
  console.log 'previousVersion', details.previousVersion

client = new Dropbox.Client({ key: 'wde9f9j8u65zbce' })
client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
  receiverPath: "/chrome_oauth_receiver.html"}))

client.authenticate (error, client) ->
  if error
    showError(error)
