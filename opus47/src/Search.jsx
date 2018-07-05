import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { 
  Navbar, NavItem, Nav,
  Button, ButtonToolbar, 
  Form, FormGroup, Col, ControlLabel, FormControl
} from 'react-bootstrap';

const queryString = require('query-string');

class PieceEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movements: [""],
      parts: ["Violin"],
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
      ],
      keyList: [
        'C Major',
        'G Major',
        'D Major',
        'A Major',
        'E Major',
        'B Major',
        'F Sharp Major',
        'C Sharp Major',
        'A Minor',
        'E Minor',
        'B Minor',
        'F Sharp Minor',
        'C Sharp Minor',
        'G Sharp Minor',
        'D Sharp Minor',
        'F Major',
        'B Flat Major',
        'E Flat Major',
        'A Flat Major',
        'D Flat Major',
        'G Flat Major',
        'C Flat Major',
        'D Minor',
        'G Minor',
        'C Minor',
        'F Minor',
        'B Flat Minor',
        'E Flat Minor',
        'A Flat minor'
      ],
      
      composer: "",
      title: "",
      key: "",
      number: "",
      catalog: "",

      handleClose: {},
    }
  }

  composerChange(event) {
    this.setState({composer: event.target.value});
  }
  titleChange(event) {
    this.setState({title: event.target.value});
  }
  keyChange(event) {
    this.setState({key: event.target.value});
  }
  numberChange(event) {
    this.setState({number: event.target.value});
  }
  catalogChange(event) {
    this.setState({catalog: event.target.value});
  }
  partChange(event, i) {
    var parts = this.state.parts.slice();
    parts[i] = event.target.value;
    this.setState({
      parts: parts
    });
  }
  movementChange(event, i) {
    var movements = this.state.movements.slice();
    movements[i] = event.target.value;
    this.setState({
      movements: movements
    });
  }

  appendPart() {
    this.setState({
      parts: this.state.parts.concat([""])
    });
  }

  removePart() {
    if (this.state.parts.length <= 1) {
      return;
    }
    this.setState({
      parts: this.state.parts.slice(0, this.state.parts.length-1)
    });
  }

  appendMovement() {
    this.setState({
      movements: this.state.movements.concat([""])
    });
  }

  removeMovement() {
    if (this.state.movements.length <= 1) {
      return;
    }
    this.setState({
      movements: this.state.movements.slice(0, this.state.movements.length-1)
    });
  }

  doUpload(e) {

    e.preventDefault();

    console.log(this.state);

    var cname = this.state.composer.split(/\s+/);

    var c = {};
    if (cname.length > 2) {
      c = {
        first: cname[0],
        middle: cname[1],
        last: cname[2]
      };
    }
    else {
      c = {
        first: cname[0],
        last: cname[1]
      };
    }

    var data = {
      composer: c,
      title: this.state.title,
      key: { name: this.state.key },
      catalog: this.state.catalog,
      number: parseInt(this.state.number, 10),
      movements: this.state.movements.map((x, i) => ({title: x, number: i})),
      parts: this.state.parts.map(x => ({name: x}))
    }

    console.log(data);

    console.log(e);

    //var form_data = new FormData();
    //form_data.append("json", JSON.stringify(data));

    fetch('https://opus47.io/pieces', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then( x => x.json() )
      .then( x => console.log(x) )

  }
beeth
  onClose() {
    this.props.handleClose();
  }

  render() {

      return (
        <div className="new-piece-div">
          <Form horizontal onSubmit={e => this.doUpload(e)}>
            <FormGroup controlId="composer">
              <Col componentClass={ControlLabel} sm={2}>
                Composer
              </Col>
              <Col sm={9}>
                <FormControl 
                  type="text" 
                  placeholder="Name" 
                  value={this.state.composer} 
                  onChange={e => this.composerChange(e)}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="title">
              <Col componentClass={ControlLabel} sm={2}>
                Title
              </Col>
              <Col sm={9}>
                <FormControl 
                  type="text" 
                  placeholder="Arrangement" 
                  value={this.state.title} 
                  onChange={e => this.titleChange(e)}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="key">
              <Col componentClass={ControlLabel} sm={2}>
                Key
              </Col>
              <Col sm={9}>
                <FormControl 
                  componentClass="select"
                  placeholder="C Major" 
                  value={this.state.key} 
                  onChange={e => this.keyChange(e)}
                >
                {this.state.keyList.map(
                  x => <option key={x} value={x}> {x} </option> 
                )}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup controlId="number">
              <Col componentClass={ControlLabel} sm={2}>
                Number
              </Col>
              <Col sm={9}>
                <FormControl 
                  type="text" 
                  placeholder={0}
                  value={this.state.number} 
                  onChange={e => this.numberChange(e)}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="catalog">
              <Col componentClass={ControlLabel} sm={2}>
                Catalog
              </Col>
              <Col sm={9}>
                <FormControl 
                  type="text" 
                  placeholder="Catalog" 
                  value={this.state.catalog} 
                  onChange={e => this.catalogChange(e)}
                />
              </Col>
            </FormGroup>
            <table className="frmtable">
              <tbody>
                <tr>
                  <td>
                    {
                      this.state.parts.map((x,i) => {
                        return (
                          <FormGroup key={x.k+i.toString()}>
                            <Col sm={10}>
                              <FormControl 
                                componentClass="select" 
                                placeholder="Violin"
                                value={this.state.parts[i]}
                                onChange={e => this.partChange(e, i)}
                              >
                                {this.state.partList.map(
                                  x => <option key={x.v} value={x.k}> {x.k} </option> )}
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
                            onClick={x => this.appendPart()}
                          > </span>
                          <span 
                            className="glyphicon glyphicon-minus frmnew" 
                            onClick={x => this.removePart()}
                          > </span>
                        </ButtonToolbar>
                      </Col>
                    </FormGroup>
                  </td>
                  <td>
                    {
                      this.state.movements.map((x, i) => {
                        return (
                          <FormGroup key={x.k+i.toString()}>
                            <Col sm={9}>
                              <FormControl 
                                type="text" 
                                placeholder="Movement" 
                                value={this.state.movements[i]}
                                onChange={e => this.movementChange(e, i)}
                              />
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
                            onClick={x => this.appendMovement()}
                          > </span>
                          <span 
                            className="glyphicon glyphicon-minus frmnew" 
                            onClick={x => this.removeMovement()}
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
                  <Button 
                    type="submit" 
                    bsStyle="success" >
                    Upload
                  </Button>
                  <Button 
                    type="reset" 
                    bsStyle="danger" 
                    onClick={ x => this.onClose() } >
                    Cancel
                  </Button>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
        </div>
      );

  }
}

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
