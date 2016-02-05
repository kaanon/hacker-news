var News = require('./NewsCollection');
var NewsView = require('./NewsView');


var news = new News();
var viewer = new NewsView({collection:news})

news.fetch().then(function(){
	// Load each model, use "load" function to do special things
	// in addition to the normal sync
	news.each(function(model, index){
		model.load();
	});
	
	viewer.render();
});
