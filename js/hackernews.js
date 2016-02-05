(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var News = __webpack_require__(1);
	var NewsView = __webpack_require__(3);
	
	var news = new News();
	var viewer = new NewsView({ collection: news });
	
	news.fetch().then(function () {
		// Load each model, use "load" function to do special things
		// in addition to the normal sync
		news.each(function (model, index) {
			model.load();
		});
	
		viewer.render();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var ItemModel = __webpack_require__(2);
	var News = Backbone.Collection.extend({
		url: 'http://hacker-news.firebaseio.com/v0/topstories.json',
		model: ItemModel,
		parse: function (data) {
			// Make sure each element in the array is at least a simple object with an id
			return data.map(function (id) {
				return { id: id, key: id };
			}).slice(0, 100);
		}
	});
	module.exports = News;

/***/ },
/* 2 */
/***/ function(module, exports) {

	var Item = Backbone.Model.extend({
		url: function () {
			return 'http://hacker.postgather.com/item/{id}'.replace('{id}', this.get('id'));
		},
		load: function () {
			var that = this;
			return this.fetch().then(function () {
				that.trigger('update');
			});
		},
		parse: function (data) {
			data.has_photo = data.photo ? 'Has Photo' : 'No Photo';
			return data;
		}
	
	});
	module.exports = Item;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var NewsViewer = __webpack_require__(4);
	var View = Backbone.View.extend({
		el: '#news .viewer',
		render: function () {
			this.reactView = React.createElement(NewsViewer, { collection: this.collection, view: this });
			ReactDOM.unmountComponentAtNode(this.el);
			ReactDOM.render(this.reactView, this.el);
		}
	});
	module.exports = View;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Dat Viewer
	 */
	// var Pagination = require('./pagination.jsx');
	var List = __webpack_require__(5);
	var Pagination = __webpack_require__(6);
	var Filters = __webpack_require__(7);
	
	var DataViewer = React.createClass({
	    displayName: 'DataViewer',
	
	    // This happens before the initial render of the component
	    componentWillMount: function componentWillMount() {
	        var that = this;
	        // NOTE: When the collection updates, force a re-render
	        this.props.collection.on('update', function () {
	            that.forceUpdate();
	        });
	        this.props.collection.on('sort', function () {
	            that.forceUpdate();
	        });
	    },
	    /**
	     * The initial state of this page
	     * @method getInitialState
	     */
	    getInitialState: function getInitialState() {
	        return {
	            filter: 'all',
	            filterBy: 'has_photo',
	            page: 1,
	            perPage: 10
	        };
	    },
	
	    // Go to a different page
	    changePage: function changePage(newPage) {
	        this.setState({ page: newPage });
	        // return;
	        // var that = this,
	        //     el = ReactDOM.findDOMNode(this);
	        // $(el).slideUp(250, function(){
	        //     that.setState({ page: newPage });   
	        //     setTimeout(function(){
	        //         $(el).slideDown();
	        //     },250);
	        // });
	    },
	
	    loadMore: function loadMore() {
	        // NOTE: direct communication with the backbone collection
	        this.props.collection.loadMore();
	
	        var parentElement = ReactDOM.findDOMNode(this).parentNode,
	            topOffset = $(parentElement).offset().top - 60;
	        $('body,html').animate({ scrollTop: topOffset + 'px' });
	    },
	
	    // When the filters are updated, change the state of the component
	    onUpdateFilter: function onUpdateFilter(opts) {
	        var opts = _.extend({
	            page: 1
	        }, opts);
	        this.setState(opts);
	    },
	
	    /**
	     * Get the filtered questions for use when rendering
	     * @method getFilteredQuestions
	     * @return {array}
	     */
	    getFilteredModels: function getFilteredModels() {
	        var filterBy = this.state.filterBy,
	            currentFilter = this.state.filter,
	            filteredModels = [];
	
	        if (this.state.filter === 'all') {
	            filteredModels = this.props.collection.models;
	        } else {
	            filteredModels = this.props.collection.filter(function (model) {
	                return model.get(filterBy) === currentFilter;
	            });
	        }
	        return filteredModels;
	    },
	    /**
	     * Render the collection
	     * @method render
	     */
	    render: function render() {
	        var startIdx = (this.state.page - 1) * this.state.perPage,
	            endIdx = this.state.page * this.state.perPage,
	            rows = this.getFilteredModels(),
	            displayItems = rows.slice(startIdx, endIdx),
	            numPages = Math.ceil(rows.length / this.state.perPage);
	
	        // NOTE: the updateFilter and updateFilterBy callbacks are passed into the Filters component for the communication between components
	        return React.createElement(
	            'section',
	            null,
	            React.createElement(Filters, { collection: this.props.collection, filter: this.state.filter, filterBy: this.state.filterBy, updateFilter: this.onUpdateFilter, updateFilterBy: this.onUpdateFilterBy }),
	            React.createElement(Pagination, { changePage: this.changePage, page: this.state.page, numPages: numPages }),
	            React.createElement(List, { collection: displayItems, titleKey: this.props.view.titleKey, contentKey: this.props.view.contentKey }),
	            React.createElement(Pagination, { changePage: this.changePage, page: this.state.page, numPages: numPages })
	        );
	    }
	});
	module.exports = DataViewer;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	/**
	 * Data View
	 *
	 * The list of items
	 */
	var Item = __webpack_require__(9);
	var List = React.createClass({
	    displayName: 'List',
	
	    render: function render() {
	        var items = this.props.collection.map(function (model) {
	            return React.createElement(Item, _extends({ model: model }, model.attributes));
	        });
	        return React.createElement(
	            'div',
	            { className: 'list' },
	            items
	        );
	    }
	});
	
	module.exports = List;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Pagination View
	 *
	 * A single note within a list of notes.
	 */
	
	var Pagination = React.createClass({
	    displayName: 'Pagination',
	
	    // Go to the previous page
	    prevPage: function prevPage() {
	        if (this.props.page - 1 > 0) {
	            this.props.changePage(this.props.page - 1);
	        }
	    },
	
	    // Go to the next page
	    nextPage: function nextPage() {
	        if (this.props.page + 1 <= this.props.numPages) {
	            this.props.changePage(this.props.page + 1);
	        }
	    },
	
	    render: function render() {
	        // The data attributes for the <figure> tags are for the circleProgess plugin
	        return React.createElement(
	            'div',
	            { className: 'pagination' },
	            React.createElement(
	                'a',
	                { onClick: this.prevPage, className: 'previous' + (this.props.page <= 1 ? ' disabled' : '') },
	                'Previous Page'
	            ),
	            React.createElement(
	                'span',
	                null,
	                'Page ',
	                this.props.page,
	                ' of ',
	                this.props.numPages
	            ),
	            React.createElement(
	                'a',
	                { onClick: this.nextPage, className: 'next' + (this.props.page >= this.props.numPages ? ' disabled' : '') },
	                'Next Page'
	            )
	        );
	    }
	});
	
	module.exports = Pagination;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Filters View
	 */
	var nicename = function nicename(str) {
	    str = str.replace(/-/, ' ').toLowerCase();
	    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function (s) {
	        return s.toUpperCase();
	    });
	};
	var Sort = __webpack_require__(8);
	var Filters = React.createClass({
	    displayName: 'Filters',
	
	    /**
	     * Click handler for changing the filter
	     * @method changeFilter
	     * @param  {Event}     evt  
	     * @return {[type]}
	     */
	    changeFilter: function changeFilter(evt) {
	        var filter = $(evt.currentTarget).data('filter');
	
	        // Communicate with the parent component to update the filter
	        this.props.updateFilter({ filter: filter });
	    },
	    onUpdateSort: function onUpdateSort(sort) {
	        this.props.collection.comparator = function (model) {
	            return -model.get(sort);
	        };
	        this.props.collection.sort();
	        this.props.updateFilter({ page: 1 });
	    },
	
	    render: function render() {
	        var navElements = [],
	            navOptions = [],
	            filterTitle,
	            filterCount,
	            filterClassName;
	
	        // This is for displaying the options you can filter by
	        var filters = this.props.collection.groupBy(this.props.filterBy);
	        for (var filterKey in filters) {
	            filterTitle = nicename(filterKey);
	            filterCount = filters[filterKey].length;
	            filterClassName = this.props.filter === filterKey ? 'active' : '';
	
	            navElements.push(React.createElement(
	                'a',
	                { key: filterKey, onClick: this.changeFilter, className: filterClassName, 'data-filter': filterKey },
	                filterTitle,
	                ' ',
	                React.createElement(
	                    'strong',
	                    null,
	                    filterCount
	                )
	            ));
	        }
	
	        return React.createElement(
	            'section',
	            { className: 'filters' },
	            React.createElement(
	                'nav',
	                null,
	                React.createElement(
	                    'label',
	                    null,
	                    'Filter :'
	                ),
	                React.createElement(
	                    'a',
	                    { onClick: this.changeFilter, className: this.props.filter === 'all' ? 'active' : '', 'data-filter': 'all' },
	                    'All ',
	                    React.createElement(
	                        'strong',
	                        null,
	                        this.props.collection.length
	                    )
	                ),
	                navElements,
	                React.createElement(Sort, { collection: this.props.collection, updateSort: this.onUpdateSort })
	            )
	        );
	    }
	});
	
	module.exports = Filters;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Filters View
	 */
	var nicename = function nicename(str) {
	    str = str.replace(/-/, ' ').toLowerCase();
	    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function (s) {
	        return s.toUpperCase();
	    });
	};
	
	var Filters = React.createClass({
	    displayName: 'Filters',
	
	    /**
	     * Click handler for changing the filter
	     * @method changeFilter
	     * @param  {Event}     evt  
	     * @return {[type]}
	     */
	    changeSort: function changeSort(evt) {
	        var sort = $(evt.currentTarget).val();
	        // Communicate with the parent component to update the filter
	        this.props.updateSort(sort);
	    },
	
	    render: function render() {
	        var navElements = [],
	            navOptions = [],
	            filterTitle,
	            filterCount,
	            filterClassName;
	
	        // This is for displaying the options you can filter by
	        var options = ['numComments', 'score', 'time'].map(function (sort) {
	            return React.createElement(
	                'option',
	                { key: sort },
	                sort
	            );
	        });
	
	        return React.createElement(
	            'select',
	            { className: 'sort', onChange: this.changeSort },
	            React.createElement(
	                'option',
	                null,
	                '--sorting'
	            ),
	            options
	        );
	    }
	});
	
	module.exports = Filters;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Data View
	 *
	 * The list of items
	 */
	var Item = React.createClass({
	    displayName: 'Item',
	
	    componentWillMount: function componentWillMount() {
	        var that = this;
	        // NOTE: When the collection updates, force a re-render
	        this.props.model.on('change', function () {
	            that.forceUpdate();
	        });
	    },
	    render: function render() {
	        var attr = this.props.model.attributes,
	            isEnriched = attr.title ? true : false;
	        if (!isEnriched) {
	            return React.createElement(
	                'article',
	                null,
	                React.createElement(
	                    'div',
	                    null,
	                    React.createElement(
	                        'h1',
	                        null,
	                        this.props.id
	                    ),
	                    React.createElement(
	                        'p',
	                        null,
	                        'Loading...'
	                    )
	                )
	            );
	        }
	        var img = attr.photo ? React.createElement(
	            'a',
	            { href: attr.url },
	            React.createElement('img', { src: attr.photo })
	        ) : '';
	        return React.createElement(
	            'article',
	            null,
	            img,
	            React.createElement(
	                'div',
	                null,
	                React.createElement(
	                    'h1',
	                    null,
	                    React.createElement(
	                        'a',
	                        { href: attr.url },
	                        attr.title
	                    )
	                ),
	                React.createElement(
	                    'h2',
	                    null,
	                    attr.timeStamp,
	                    ' ',
	                    React.createElement(
	                        'strong',
	                        null,
	                        'Score: ',
	                        attr.score
	                    )
	                ),
	                React.createElement(
	                    'p',
	                    null,
	                    attr.description
	                ),
	                React.createElement(
	                    'cite',
	                    null,
	                    attr.numComments,
	                    ' comments'
	                )
	            )
	        );
	    }
	});
	
	module.exports = Item;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=../hackernews.map?_v=48c5483a02edc45ea546