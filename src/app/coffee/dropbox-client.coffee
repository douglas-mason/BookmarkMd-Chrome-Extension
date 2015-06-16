  # class DropboxClient
  # constructor: ->
  #   @initialize()

  # initialize: =>
# config = new Config()
# client = new Dropbox.Client({ key: @config.dropboxKey })
client = new Dropbox.Client({ key: 'wde9f9j8u65zbce' })
client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
  receiverPath: "/chrome_oauth_receiver.html"}))
