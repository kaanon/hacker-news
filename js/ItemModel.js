var Item = Backbone.Model.extend({
	url: function(){
		return 'http://localhost:1337/item/{id}'.replace('{id}',this.get('id'));
	},
	load: function(){
		var that = this;
		return this.fetch().then(function(){ that.trigger('update'); })
	},
	parse: function(data){
		data.has_photo =  data.photo ? 'Has Photo' : 'No Photo';
		return data;
	}

});
module.exports = Item;