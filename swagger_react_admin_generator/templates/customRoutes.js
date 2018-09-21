import React from 'react';
import { Route } from 'react-router-dom';

import catchAll from './catchAll';

export default [
    <Route exact path="/catchAll" component={catchAll} />
];
