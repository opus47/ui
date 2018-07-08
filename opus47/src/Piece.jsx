import React, { Component } from 'react';
import './App.css';
import PieceEditor from './PieceEditor.jsx';
import { 
  Button, ButtonToolbar, 
  Form, FormGroup, Col, ControlLabel, FormControl 
} from 'react-bootstrap';

const queryString = require('query-string');

class Piece extends Component {

  constructor(props) {
    super(props);
    var qs = queryString.parse(window.location.search);
    this.state = {
      ready: false,
      id: qs.id,
      newPerf: false,
      editPiece: false
    }
    this.fetchData()
  }

  newPerformance() {

    console.log("new performance");
    this.setState({
      newPerf: true
    });

  }

  renderNewPerformance() {
    if (this.state.newPerf === true) {
      return(
        <div className="newPerf">
          <Form horizontal>
            <FormGroup controlId="venue" className="pform">
              <Col componentClass={ControlLabel} sm={2}>
                Performance
              </Col>
              <Col sm={10}>
                <FormControl type="text" placeholder="Venue" />
              </Col>
            </FormGroup>
            <table className='frmtable'>
            <tbody>
            <tr>
            <td>
              {
                this.state.info.parts.map(x => {
                  return (
                    <FormGroup key={x.id} className="pform">
                      <Col componentClass={ControlLabel} sm={3}>
                        {x.name}
                      </Col>
                      <Col sm={6}>
                        <FormControl type="text" placeholder="Musician" />
                      </Col>
                    </FormGroup>
                  );
                })
              }
            </td>
            <td>
              {
                this.state.info.movements.map(x => {
                  return (
                    <FormGroup key={x.id} className="pform">
                      <Col componentClass={ControlLabel} sm={6}>
                        {x.title}
                      </Col>
                      <Col sm={4}>
                        <FormControl componentClass="select" placeholder="Track">
                          <option value="1">Track 1</option>
                          <option value="2">Track 2</option>
                          <option value="3">Track 3</option>
                          <option value="4">Track 4</option>
                          <option value="5">Track 5</option>
                          <option value="6">Track 6</option>
                          <option value="7">Track 7</option>
                        </FormControl>
                      </Col>
                    </FormGroup>
                  );
                })
              }
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
                    onClick={ x => this.setState({newPerf: false}) } >
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
      return <div className="no-new" />;
    }
  }

  renderNewButton() {
    if (this.state.newPerf === false) {
      return (
        <span 
          className="glyphicon glyphicon-plus plus-perf"
          onClick={(x) => this.newPerformance(x)}
        >
        </span>
      );
    }
    else {
      return (
        <span 
          className="glyphicon glyphicon-plus plus-perf-disabled"
        >
        </span>
      );
    }

  }

  onEditPieceClose(data) {
    this.setState({editPiece: false});

    if(data) {
      this.setState({info: data});
    }
  }

  renderEditPiece() {
    if (this.state.editPiece === true) {
      return <PieceEditor 
          composer={this.state.info.composer.first + ' ' + this.state.info.composer.last}
          title={this.state.info.title}
          keyy={this.state.info.key.name}
          number={this.state.info.number}
          catalog={this.state.info.catalog}
          movements={this.state.info.movements}
          parts={this.state.info.parts}
          id={this.state.info.id}
          handleClose={(x) => this.onEditPieceClose(x)}
        >
        </PieceEditor>;
    }
    else {
      return <div className="no-new-piece" />;
    }
  }

  render() {
    if (this.state.ready === true) {
      return ( 
        <div>
          <header className="PieceHeader">
            <div className="Piece">
              <span className="Composer"> 
                {this.state.info.composer.first} {this.state.info.composer.last}:&nbsp;
              </span>
              <span className="Title">
                {this.state.info.title} in {this.state.info.key.name}&nbsp;
              </span>
              <span className="Catalog">
                ~ {this.state.info.catalog}
              </span>
              <span 
                className="glyphicon glyphicon-pencil opusbtn editbtn"
                onClick={ x => this.setState({editPiece: true}) }
              >
              </span>
            </div>
          </header>
          { this.renderEditPiece() }
          <div className="PerformanceList">
            <table>
            <tbody>
            <tr>
              <td><h2>Performances</h2></td>
              <td>
                { this.renderNewButton() }
              </td>
            </tr>
            </tbody>
            </table>
            {
              this.renderNewPerformance()
            }
            {
              this.state.performances.map(x => {
                console.log(x);
                return (
                  <div key={x.id} >
                    <h3> {x.venue} </h3>
                    <table>
                    <tbody>
                    <tr>
                    <td>
                    <div className="performer-list">
                      {
                        x.performers.map(y => {
                          return (
                            <div key={y.id} className="performer-list-item">
                              <span className="p-musician">{y.musician}</span>:&nbsp;
                              <span className="p-part">{y.part}</span>
                            </div>
                          );
                        })
                      }
                    </div>
                    </td>
                    <td>
                    <div className="recording-list">
                      {
                        x.recordings.map(y => {
                          return (
                            <div key={y.id} className="recording-list-item">
                              <a href={ "/files/" + y.file } >{y.number}. {y.movement}</a>
                            </div>
                          );
                        })
                      }
                    </div>
                    </td>
                    </tr>
                    </tbody>
                    </table>
                  </div>
                );
              })
            }
          </div>
        </div>
      );
    }
    return <div></div>;
  }

  fetchData() {

    fetch('https://opus47.io/pieces/'+this.state.id)
      .then(x => x.json())
      .then(x => {
        this.setState({ 
          ready: false,
          info: x, 
          movements: []
        })
        console.log(x);
      })
      .then(_ => {
        fetch('https://opus47.io/pieces/'+this.state.id+'/performances')
          .then(x => x.json())
          .then(x => this.setState({
            ready:true,
            performances: x
          }));
      });
        

  }
}

export default Piece;
