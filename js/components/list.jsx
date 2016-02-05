/**
 * Data View
 *
 * The list of items
 */
var Item = require('./item.jsx');
var List = React.createClass({
    render: function () {
        var items = this.props.collection.map(function(model){
            return  (<Item model={model} {...model.attributes}/>)
        });
        return (
            <div className='list'>
                {items}
            </div>
        );
    }
});


module.exports = List;