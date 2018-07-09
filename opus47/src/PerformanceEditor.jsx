import React, { Component } from 'react';
import './App.css';
import { 
  Button, ButtonToolbar, 
  Form, FormGroup, Col, ControlLabel, FormControl
} from 'react-bootstrap';

class PerformanceEditor extends Component {

  constructor(props) {

    super(props);

    this.state = {
      title: this.props.title || "",
      performers: this.props.performers || [],
      files: this.props.files || [],
      info: this.props.info
    };

  }

  performerChange(event, i) {
    // make copy of array
    var performers = this.state.performers.slice();
    performers[i] = event.target.value
    this.setState({ performers: performers })
  }

  fileChange(event, i) {
    // make copy of array
    var files = this.state.files.slice();
    files[i] = event.target.files[0];
    this.setState({ files: files})
  }

  uploadPerformance(e) {

    e.preventDefault()

    //
    // first, post the performance information
    //

    var data = {
      pieceId: this.state.info.id,
      title: this.state.title,
      description: this.state.description,
      date: this.state.date,
      performers: this.state.performers.map(x => ({
        id: "",
        musician: x,
        part: "" //TODO
      }))
    };

    console.log(data);

    fetch('https://opus47.io/performances', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(x => x.json())
    .then(x => console.log(x))

    //
    // then, post the attached recordings
    //

    for (var i in this.state.files) {

      var recording_data = new FormData();
      recording_data.append('performance', this.state.title);
      recording_data.append('movement', Number(i)+1);
      recording_data.append('file', this.state.files[i]);

      fetch('https://opus47.io/recordings', {
        method: 'PUT',
        body: recording_data
      })
      .then(x => x.json())
      .then(x => console.log(x))
    }


    this.props.handleClose();

  }

  onClose() {
    this.props.handleClose();
  }

  render() {
    return(
      <div className="newPerf">
        <Form horizontal onSubmit={e => this.uploadPerformance(e)}>
          <FormGroup controlId="venue" className="pform">
            <Col componentClass={ControlLabel} sm={2}>
              Performance
            </Col>
            <Col sm={10}>
              <FormControl 
                type="text" 
                placeholder="Title" 
                value={this.state.title}
                onChange={e => this.setState({title: e.target.value})}
              />
            </Col>
          </FormGroup>
          <table className='frmtable'>
          <tbody>
          <tr>
          <td>
            {
              this.state.info.parts.map((x,i) => {
                return (
                  <FormGroup key={x.id} className="pform">
                    <Col componentClass={ControlLabel} sm={3}>
                      {x.name}
                    </Col>
                    <Col sm={6}>
                      <FormControl 
                        type="text" 
                        placeholder="Musician" 
                        value={this.state.performers[i]}
                        onChange={e => this.performerChange(e, i)}
                      />
                    </Col>
                  </FormGroup>
                );
              })
            }
          </td>
          <td>
            {
              this.state.info.movements.map((x,i) => {
                return (
                  <FormGroup key={x.id} className="pform">
                    <Col componentClass={ControlLabel} sm={6}>
                      {x.title}
                    </Col>
                    <Col sm={4}>
                      <input 
                        type="file" 
                        placeholder="File" 
                        onChange={e => this.fileChange(e, i)}
                      />
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

export default PerformanceEditor;
