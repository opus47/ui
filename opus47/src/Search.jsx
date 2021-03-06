import React, { Component } from 'react';
import './App.css';
import PieceEditor from './PieceEditor.jsx';
import { Link } from 'react-router-dom';
import { 
  Navbar, NavItem, Nav,
  FormGroup, FormControl
} from 'react-bootstrap';

const queryString = require('query-string');

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      newPiece: false,
    };
  }

  onNewPieceClose() {
    this.setState({newPiece: false});
  }

  renderNewPiece() {
    if (this.state.newPiece === true) {
      return <PieceEditor handleClose={() => this.onNewPieceClose()}></PieceEditor>;
    }
    else {
      return <div className="no-new-piece" />;
    }
  }


  render() {
    return (
      <div>
        <Navbar >
          <Navbar.Header>
            <Navbar.Brand> Opus47 </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <SearchBar
                reportSearchResults={(x) => this.onNewSearchResults(x)}
              />
            </Nav>
            <Nav pullRight>
              <NavItem>
                <span 
                  className="glyphicon glyphicon-plus opusbtn"
                  onClick={ x => this.setState({newPiece: true}) }
                >
                </span>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        { this.renderNewPiece() }
        <SearchResult results={this.state.results}></SearchResult>
      </div>
    );
  }

  onNewSearchResults(results) {
    console.log("results: ", results);
    this.setState({results: results});
  }
}

class SearchBar extends React.Component {

  constructor(props) {
    super(props);


    var qs = queryString.parse(window.location.search);
    if ('search' in qs) {
      this.state = {
        query: qs.search
      }
      this.handleChange({
        target: {
          value: qs.search
        }
      }, false);
    }
    else {
      this.state = {
        query: ""
      }
    }
  }

  render() {
    return (
      <Navbar.Form pullLeft>
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Search"
            className="Search"
            value={this.state.query}
            onChange={(x) => this.handleChange(x)}
          />
        </FormGroup>
      </Navbar.Form>
    );
  }

  handleChange(e, set_state = true) {
    if(set_state) {
      this.setState({
        query: e.target.value
      })
    }
    console.log(e.target.value);
    //this.props.reportSearchResults(['a','b','c']);
    var etext = encodeURI(e.target.value);
    fetch('https://opus47.io/pieces/search?text='+etext)
      .then((x) => {
        return x.json();
      })
      .then((x) => {
        var newurl = 
          window.location.protocol + "//" + 
          window.location.host + 
          window.location.pathname + 
          '?search=' + etext;

        window.history.pushState({path:newurl},'',newurl);

        console.log(x);
        console.log(x.map(y => y.clast));
        this.props.reportSearchResults(x.map(y => y))
      })
  }
}

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
                search: '?id='+result.id,
                }}
              >
                <span className="Composer">{result.composer.last}:</span>&nbsp;
                <span className="Title">{result.title} in {result.key.name}</span> ~&nbsp;
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

export default Search;
