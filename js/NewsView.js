var NewsViewer = require('./components/news-viewer.jsx');
var View = Backbone.View.extend({
	el:'#news .viewer',
	render: function(){
		this.reactView = React.createElement(NewsViewer, {collection: this.collection, view: this });
		ReactDOM.unmountComponentAtNode(this.el);        
       	ReactDOM.render(this.reactView, this.el);
	}
});
module.exports = View;