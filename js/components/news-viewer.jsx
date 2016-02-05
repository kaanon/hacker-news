/**
 * Dat Viewer
 */
// var Pagination = require('./pagination.jsx');
var List = require('./list.jsx');
var Pagination = require('./pagination.jsx');
var Filters = require('./filters.jsx');

var DataViewer = React.createClass({
    // This happens before the initial render of the component
    componentWillMount: function(){
        var that = this;
        // NOTE: When the collection updates, force a re-render
        this.props.collection.on('update', function(){
            that.forceUpdate();
        });
        this.props.collection.on('sort', function(){
            that.forceUpdate();
        });
    },
    /**
     * The initial state of this page
     * @method getInitialState
     */
    getInitialState: function () {
        return { 
            filter: 'all',
            filterBy: 'has_photo',
            page: 1,
            perPage: 10
        };
    },

    // Go to a different page
    changePage: function(newPage){
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

    loadMore: function(){
        // NOTE: direct communication with the backbone collection
        this.props.collection.loadMore();

        var parentElement = ReactDOM.findDOMNode(this).parentNode,
            topOffset = $(parentElement).offset().top - 60;
        $('body,html').animate({scrollTop:topOffset + 'px'});
    },

    // When the filters are updated, change the state of the component
    onUpdateFilter: function (opts) {
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
    getFilteredModels: function(){
        var filterBy = this.state.filterBy,
            currentFilter = this.state.filter,
            filteredModels = [];

        if(this.state.filter === 'all'){
            filteredModels = this.props.collection.models;
        } else {
            filteredModels = this.props.collection.filter(function(model){ 
                return model.get(filterBy) === currentFilter;
            });
        }
        return filteredModels;
    },
    /**
     * Render the collection
     * @method render
     */
    render: function () {
        var startIdx = (this.state.page - 1) * this.state.perPage,
            endIdx = this.state.page * this.state.perPage,
            rows = this.getFilteredModels(),
            displayItems  = rows.slice(startIdx, endIdx),
            numPages = Math.ceil(rows.length / this.state.perPage);

        // NOTE: the updateFilter and updateFilterBy callbacks are passed into the Filters component for the communication between components
        return (
        <section>
            <Filters collection={this.props.collection} filter={this.state.filter} filterBy={this.state.filterBy} updateFilter={this.onUpdateFilter} updateFilterBy={this.onUpdateFilterBy} />
            <Pagination changePage={this.changePage} page={this.state.page} numPages={numPages} />
            <List collection={displayItems} titleKey={this.props.view.titleKey} contentKey={this.props.view.contentKey} />
            <Pagination changePage={this.changePage} page={this.state.page} numPages={numPages} />
        </section>
        );
    }
});
module.exports = DataViewer;