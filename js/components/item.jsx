/**
 * Data View
 *
 * The list of items
 */
var Item = React.createClass({
    componentWillMount: function(){
        var that = this;
        // NOTE: When the collection updates, force a re-render
        this.props.model.on('change', function(){
            that.forceUpdate();
        });
    },
    render: function () {
        var attr = this.props.model.attributes,
            isEnriched = attr.title ? true : false;
        if(!isEnriched){
            return (
                <article>
                <div>
                    <h1>{this.props.id}</h1>
                    <p>Loading...</p>
                </div>
                </article>
            );
        }
        var img = attr.photo ? (<a href={attr.url}><img src={attr.photo}/></a>) : '';
        return (
            <article>
                {img}
                <div>
                    <h1><a href={attr.url}>{attr.title}</a></h1>
                    <h2>{attr.timeStamp} <strong>Score: {attr.score}</strong></h2>
                    <p>{attr.description}</p>
                    
                    <cite>{attr.numComments} comments</cite>

                    
                </div>
            </article>
        );
    }
});

module.exports = Item;