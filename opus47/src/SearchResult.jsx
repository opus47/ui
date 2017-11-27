import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }
  render() {
    return(
      <div className="SearchResults">
      {
        this.props.results.map(function(result) {
          return (
            <div key={result.id} className="SearchResult">
              <Link to={{
                pathname: '/piece',
                search: '?id='+id,
                }}
              >
                <span className="Composer">{result.clast}</span>:&nbsp;
                <span className="Title">{result.title} in {result.key}</span> ~ &nbsp;
                <span className="Catalog">{result.catalog}</span>
              </Link>
            </div>
          )
        })
      }
      </div>
    );
  }
}

export default SearchResult;
