/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { reporter } = require('../../reporter');
const { replace } = require('../../tools/replace');

const TARGET_VERSION = '0.0.1-alpha.31';

module.exports = {
  version: TARGET_VERSION,
  from: [
    {
      version: '<=0.0.1-alpha.30',
      async migrate(options) {
        const changes = [
          {
            from: /(\$ibm-colors__[a-z]+)(--)([\d]+)/gm,
            // Capture group $1 refers to $ibm-colors__abcd
            // $2 refers to double dash (--)
            // $3 is the grade at the end
            to: '$1-$3',
          },
        ];

        await replace('**/*.scss', changes, options);
      },
    },
  ],
};
