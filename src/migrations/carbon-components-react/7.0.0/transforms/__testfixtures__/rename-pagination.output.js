import { Pagination } from 'carbon-components-react';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <>
    <Pagination />
    <Pagination customPropA="foo" />
  </>,
  document.getElementById('root')
);
