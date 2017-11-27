import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { 
  Navbar, NavItem, Nav,
  Button, ButtonToolbar, 
  Form, FormGroup, Col, ControlLabel, FormControl
} from 'react-bootstrap';

const queryString = require('query-string');

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      newPiece: false,
      newMovements: [""],
      newParts: ["Violin"],
      partList: [
        {v: 1, k: "Violin"},
        {v: 2, k: "Violin 1"},
        {v: 3, k: "Violin 2"},
        {v: 4, k: "Violin 3"},
        {v: 5, k: "Violin 4"},
        {v: 6, k: "Viola"},
        {v: 7, k: "Viola 1"},
        {v: 8, k: "Viola 2"},
        {v: 9, k: "Viola 3"},
        {v: 10, k: "Viola 4"},
        {v: 11, k: "Cello"},
        {v: 12, k: "Cello 1"},
        {v: 13, k: "Cello 2"},
        {v: 14, k: "Piano"},
        {v: 15, k: "Piano 1"},
        {v: 16, k: "Piano 2"},
        {v: 17, k: "Flute"},
        {v: 18, k: "Harp"},
        {v: 19, k: "Clarinet"},
        {v: 20, k: "Oboe"},
        {v: 21, k: "Horn"},
        {v: 22, k: "Bass"}
      ]
    };
  }

  appendNewPart() {

    this.setState({
      newParts: this.state.newParts.concat([""])
    });

  }

  removeNewPart() {
    if (this.state.newParts.length <= 1) {
      return;
    }
    this.setState({
      newParts: this.state.newParts.slice(0, this.state.newParts.length-1)
    });
  }

  appendNewMovement() {

    this.setState({
      newMovements: this.state.newMovements.concat([""])
    });

  }

  removeNewMovement() {
    if (this.state.newMovements.length <= 1) {
      return;
    }
    this.setState({
      newMovements: this.state.newMovements.slice(0, this.state.newMovements.length-1)
    });
  }

  renderNewPiece() {

    if (this.state.newPiece === true) {
      return (
        <div className="new-piece-div">
          <Form horizontal>
            <FormGroup controlId="composer">
              <Col componentClass={ControlLabel} sm={1}>
                Composer
              </Col>
              <Col sm={9}>
                <FormControl type="text" placeholder="Name" />
              </Col>
            </FormGroup>
            <FormGroup controlId="title">
              <Col componentClass={ControlLabel} sm={1}>
                Title
              </Col>
              <Col sm={9}>
                <FormControl type="text" placeholder="Arrangement" />
              </Col>
            </FormGroup>
            <FormGroup controlId="key">
              <Col componentClass={ControlLabel} sm={1}>
                Key
              </Col>
              <Col sm={9}>
                <FormControl type="text" placeholder="Key" />
              </Col>
            </FormGroup>
            <table className="frmtable">
              <tbody>
                <tr>
                  <td>
                    {
                      this.state.newParts.map(x => {
                        return (
                          <FormGroup>
                            <Col sm={10}>
                              <FormControl componentClass="select" placeholder="Violin">
                                {this.state.partList.map(
                                  x => <option key={x.v} value={x.v}> {x.k} </option> )}
                              </FormControl>
                            </Col>
                          </FormGroup>
                        );
                      })
                    }
                    <FormGroup>
                      <Col sm={10}>
                        <ButtonToolbar>
                          <span 
                            className="glyphicon glyphicon-plus frmnew" 
                            onClick={x => this.appendNewPart()}
                          > </span>
                          <span 
                            className="glyphicon glyphicon-minus frmnew" 
                            onClick={x => this.removeNewPart()}
                          > </span>
                        </ButtonToolbar>
                      </Col>
                    </FormGroup>
                  </td>
                  <td>
                    {
                      this.state.newMovements.map(x => {
                        return (
                          <FormGroup>
                            <Col sm={9}>
                              <FormControl type="text" placeholder="Movement" />
                            </Col>
                          </FormGroup>
                        );
                      })
                    }
                    <FormGroup>
                      <Col sm={10}>
                        <ButtonToolbar>
                          <span 
                            className="glyphicon glyphicon-plus frmnew" 
                            onClick={x => this.appendNewMovement()}
                          > </span>
                          <span 
                            className="glyphicon glyphicon-minus frmnew" 
                            onClick={x => this.removeNewMovement()}
                          > </span>
                        </ButtonToolbar>
                      </Col>
                    </FormGroup>
                  </td>
                </tr>
              </tbody>
            </table>
            <FormGroup>
              <Col sm={10} smOffset={5}>
                <ButtonToolbar>
                  <Button type="submit" bsStyle="success">
                    Upload
                  </Button>
                  <Button 
                    type="submit" 
                    bsStyle="danger" 
                    onClick={ x => this.setState({newPiece: false}) } >
                    Cancel
                  </Button>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
        </div>
      );
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
      });
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

  handleChange(e) {
    this.setState({
      query: e.target.value
    })
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
                <span className="Composer">{result.clast}:</span>&nbsp;
                <span className="Title">{result.title} in {result.key}</span> ~&nbsp;
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
