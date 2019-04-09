/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const migrations = new Set([require('./7.0.0')]);

module.exports = {
  name: 'carbon-components-react',
  migrations,
};
