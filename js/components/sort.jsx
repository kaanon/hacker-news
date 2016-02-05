/**
 * Filters View
 */
var nicename = function(str){
    str = str.replace(/-/,' ').toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function(s){
        return s.toUpperCase();
    });
};


var Filters =  React.createClass({
    /**
     * Click handler for changing the filter
     * @method changeFilter
     * @param  {Event}     evt  
     * @return {[type]}
     */
    changeSort: function(evt){
        var sort = $(evt.currentTarget).val();
        // Communicate with the parent component to update the filter
        this.props.updateSort(sort);
    },

    render: function () {
        var navElements = [],
            navOptions = [],
            filterTitle,
            filterCount,
            filterClassName;


        // This is for displaying the options you can filter by
        var options = ['numComments','score','time'].map(function(sort){
            return (
                <option key={sort}>{sort}</option>
            )
        })
        

        return (
            <select className='sort' onChange={this.changeSort}>
                <option>--sorting</option>
                {options}
            </select>
        );
  }
});

module.exports = Filters;