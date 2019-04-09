import { DropdownV2 } from 'carbon-components-react';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <>
    <DropdownV2 />
    <DropdownV2 customPropA="foo" />
  </>,
  document.getElementById('root')
);
