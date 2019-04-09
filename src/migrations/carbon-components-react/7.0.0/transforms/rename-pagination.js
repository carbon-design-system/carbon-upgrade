/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { replaceReactComponent } = require('../tools');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  replaceReactComponent(j, root, 'PaginationV2', 'Pagination');

  return root.toSource();
};
