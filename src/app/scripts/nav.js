(function() {
  var Nav;

  Nav = (function() {
    function Nav(baseFolderName, client) {}

    Nav.prototype.renderNavigation = function(categories) {
      var NavBar = React.createClass({
      populateCategories: function(){
        var folderName = this.baseFolderName;
        this.client.readdir(folderName, function (error, entries){
          if (error){
            return this.showError(error);
          }
          var categories = [];
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
      <NavBar title="Super Duper" data={categories}/>,
      document.getElementById("nav-container")
      );;
      return true;
    };

    return Nav;

  })();

}).call(this);
