var ItemModel = require('./ItemModel');
var News = Backbone.Collection.extend({
	url: 'http://hacker-news.firebaseio.com/v0/topstories.json',
	model: ItemModel,
	parse: function(data){
		// Make sure each element in the array is at least a simple object with an id
		return data.map(function(id){
			return { id: id, key:id };
		}).slice(0,100);
	}
});
module.exports = News;