(function() {
  window.Nav = (function() {
    function Nav(baseFolderName) {
      this.client = {};
      chrome.runtime.getBackgroundPage((function(_this) {
        return function(backgroundWindow) {
          _this.client = backgroundWindow.client;
          _this.baseFolderName = baseFolderName;
          return _this.renderNavigation();
        };
      })(this));
    }

    Nav.prototype.renderNavigation = function() {
      var self = this;
    var NavBar = React.createClass({displayName: "NavBar",
      populateCategories: function(){
        var folderName = self.baseFolderName;
        var categories = [];
        self.client.readdir(folderName, function (error, entries){
          if (error){
            //return this.showError(error);
          }
          _.forEach(entries, function (item){
            if (item.search(/^(.*\.(md)$)/i) != -1){
              var category = {
                  title: item.split('.md')[0],
                  name: item
                };
                categories.push(category);
            }
        });
        this.setState({data: categories});
        })
      },
      getInitialState: function() {
        return {data: []};
      },
      componentDidMount: function(){
        this.populateCategories();
      },
      render: function(){
        return (
          React.createElement("nav", {id: "nav", className: "navBar"}, 
            React.createElement("div", {className: "nav-wrapper"}, 
              React.createElement("div", {className: "col s12"}, 
              React.createElement("a", {className: "brand-logo"}, this.props.title), 
                React.createElement(NavItemList, {data: this.state.data}), 
                React.createElement("a", {href: "#", "data-activates": "slide-out", 
                  className: "button-collapse"}, 
                  React.createElement("i", {className: "mdi-navigation-menu"})
                )
              )
            )
          )
          );
        }
      });
          
    var NavItemList = React.createClass({displayName: "NavItemList",
      render: function(){
        var navItems = this.props.data.map(function (item){
            return React.createElement("li", {key: item.id}, React.createElement("a", {href: "#"}, item.title))
        });
        return (
          React.createElement("div", null, 
          React.createElement("ul", {className: "right hide-on-med-and-down"}, 
            navItems
          ), 
          React.createElement("ul", {id: "slide-out", className: "side-nav"}, 
            navItems
          )
          )
          );
        }
      });
          
    React.render(
      React.createElement(NavBar, {title: "MarkIt"}),
      document.getElementById("nav-container")
      );;
      return true;
    };

    return Nav;

  })();

}).call(this);
