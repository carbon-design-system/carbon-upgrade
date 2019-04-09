import { Dropdown } from 'carbon-components-react';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <>
    <Dropdown />
    <Dropdown customPropA="foo" />
  </>,
  document.getElementById('root')
);
