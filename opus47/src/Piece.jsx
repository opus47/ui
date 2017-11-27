import React, { Component } from 'react';
import './App.css';

const queryString = require('query-string');

class Piece extends Component {

  constructor(props) {
    super(props);
    var qs = queryString.parse(window.location.search);
    this.state = {
      ready: false,
      id: qs.id
    }
    this.fetchData()
  }

  render() {
    if (this.state.ready === true) {
      return ( 
        <div>
          <header className="PieceHeader">
            <div className="Piece">
              <span className="Composer"> 
                {this.state.info.cfirst} {this.state.info.clast}:&nbsp;
              </span>
              <span className="Title">
                {this.state.info.title} in {this.state.info.key}&nbsp;
              </span>
              <span className="Catalog">
                ~ {this.state.info.catalog}
              </span>
            </div>
          </header>
          <div className="PerformanceList">
            <h2>Performances</h2>
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

class Performance extends Component {

  render() {
    return (
      <div></div>
    );
  }

}

export default Piece;
