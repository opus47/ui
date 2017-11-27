import React from 'react';
import { Route } from 'react-router';

import Search from './Search.jsx';
import Piece from './Piece.jsx';

export default(
  <Route path="/" component={Search}>
    <Route exact path="/" component={Search} />
    <Route path="/piece" component={Piece} />
  </Route>
);
