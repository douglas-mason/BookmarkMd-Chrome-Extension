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
    var NavBar = React.createClass({
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
          <nav id="nav" className="navBar">
            <div className="nav-wrapper">
              <div className="col s12">
              <a className="brand-logo">{this.props.title}</a>
                <NavItemList data={this.state.data}/>
                <a href="#" data-activates="slide-out"
                  className="button-collapse">
                  <i className="mdi-navigation-menu"></i>
                </a>
              </div>
            </div>
          </nav>
          );
        }
      });
          
    var NavItemList = React.createClass({
      render: function(){
        var navItems = this.props.data.map(function (item){
            return <li key={item.id}><a href="#">{item.title}</a></li>
        });
        return (
          <div>
          <ul className="right hide-on-med-and-down">
            {navItems}
          </ul>
          <ul id="slide-out" className="side-nav">
            {navItems}
          </ul>
          </div>
          );
        }
      });
          
    React.render(
      <NavBar title="MarkIt"/>,
      document.getElementById("nav-container")
      );;
      return true;
    };

    return Nav;

  })();

}).call(this);
