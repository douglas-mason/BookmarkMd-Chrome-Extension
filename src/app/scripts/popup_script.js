(function() {
  var nav, popup,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.Popup = (function() {
    function Popup() {
      this.initialize = __bind(this.initialize, this);
      if (typeof this.initialize === "function") {
        this.initialize();
      }
    }

    Popup.prototype.initialize = function(config) {
      this.folderName = "";
      this.fileName = "";
      this.dbclient = {};
      this.folderName = (config != null ? config.folderName : void 0) || '/Bookmark';
      this.fileName = (config != null ? config.fileName : void 0) || 'bookmarks.md';
      this.dbclient = config != null ? config.client : void 0;
      return chrome.runtime.getBackgroundPage((function(_this) {
        return function(backgroundWindow) {
          var client;
          client = backgroundWindow.client;
          if (client.isAuthenticated()) {
            return _this.initialize({
              'folderName': 'Bookmarks',
              'client': client
            });
          } else {
            return client.authenticate(function(error, client) {
              if (error) {
                return _this.showError(error);
              }
            });
          }
        };
      })(this));
    };

    Popup.prototype.showError = function(error) {
      console.log("Error: " + error);
      return toast("An error has occured.  Item not saved.", 4000);
    };

    Popup.prototype.formatAsMarkdown = function(title, tags, url) {
      var tagList;
      if (tags !== void 0 && tags.length > 0) {
        tagList = tags.split(',');
        tags = '';
        tagList.forEach(function(item) {
          return tags = tags + ' #' + item.trim();
        });
      }
      return '\n' + '[' + title + tags + '](' + url + ')' + '\n';
    };

    Popup.prototype.getCategoryFileNameOverride = function(category) {
      return category.trim() + '.md';
    };

    Popup.prototype.readBookmarkFile = function() {
      var doesCategoryOverrideExist, newBookmark;
      doesCategoryOverrideExist = $('#txtCategory').val() !== void 0 && $('#txtCategory').val().length > 0;
      newBookmark = this.formatAsMarkdown($('#txtTitle').val(), $('#txtTags').val(), $('#txtUrl').val());
      if (doesCategoryOverrideExist) {
        this.fileName = this.getCategoryFileNameOverride($('#txtCategory').val());
      }
      return this.processEntry(this.fileName, this.folderName, newBookmark);
    };

    Popup.prototype.processEntry = function(fileName, folderName, bookmark) {
      var client;
      client = this.dbclient;
      return client.readdir(folderName, (function(_this) {
        return function(error, entries) {
          if (error) {
            return _this.showError(error);
          }
          if ($.inArray(fileName, entries) > -1) {
            _this.addToExistingFile(fileName, folderName, bookmark);
          } else {
            _this.addNewFile(fileName, folderName, bookmark);
          }
          return window.close();
        };
      })(this));
    };

    Popup.prototype.addToExistingFile = function(fileName, folderName, newBookmark) {
      var client, newFileData;
      newFileData = '';
      client = this.dbclient;
      return client.readFile(folderName + '/' + fileName, (function(_this) {
        return function(error, data) {
          if (error) {
            return _this.showError(error);
          }
          newFileData = data + newBookmark;
          return client.writeFile(folderName + '/' + fileName, newFileData, function(error, stat) {
            if (error) {
              return _this.showError(error);
            }
            return console.log('File saved as revision ' + stat.versionTag);
          });
        };
      })(this));
    };

    Popup.prototype.addNewFile = function(fileName, folderName, newBookmark) {
      var client, newFileData, title;
      newFileData = '';
      client = this.dbclient;
      title = '#' + fileName.replace('.md', '') + '\n';
      newFileData = title + newFileData + newBookmark;
      return client.writeFile(folderName + '/' + fileName, newFileData, (function(_this) {
        return function(error, stat) {
          if (error) {
            return _this.showError(error);
          }
          return console.log('File saved as revision ' + stat.versionTag);
        };
      })(this));
    };

    return Popup;

  })();

  popup = new window.Popup();

  nav = new window.Nav(popup.folderName);

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    $('#txtUrl').val(tabs[0].url);
    return $('#txtTitle').val(tabs[0].title);
  });

  $('#btnSave').on("click", function() {
    return popup.readBookmarkFile();
  });

  $(".button-collapse").sideNav();

}).call(this);
