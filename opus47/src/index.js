import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Search from './Search.jsx';
import Piece from './Piece.jsx';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
  <div>
    <Route exact path="/" component={Search} />
    <Route path="/piece" component={Piece} />
  </div>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
