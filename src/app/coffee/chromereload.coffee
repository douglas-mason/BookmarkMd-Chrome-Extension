'use strict'

# Reload client for Chrome Apps & Extensions.
# The reload client has a compatibility with livereload.
# WARNING: only supports reload command.

LIVERELOAD_HOST = 'localhost:'
LIVERELOAD_PORT = 35729
connection = new WebSocket('ws://' +
  LIVERELOAD_HOST +
  LIVERELOAD_PORT +
  '/livereload')

connection.onerror = (error) ->
  console.log('reload connection got error' + JSON.stringify(error))

connection.onmessage = (e) ->
  if (e.data)
    data = JSON.parse(e.data)
    if (data && data.command == 'reload')
      chrome.runtime.reload()
