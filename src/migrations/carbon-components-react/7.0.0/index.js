/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const which = require('npm-which')(__dirname);
const path = require('path');
const spawn = require('cross-spawn');
const { reporter } = require('../../../reporter');

const TARGET_VERSION = '7.0.0';

module.exports = {
  version: TARGET_VERSION,
  from: [
    {
      version: '>=6.x',
      async migrate(options) {
        console.log('wazzup');
        return;
        const jscodeshift = which.sync('jscodeshift');
        const transforms = [
          require.resolve('./transforms/rename-dropdown'),
          require.resolve('./transforms/rename-pagination'),
        ];
        const args = [
          '--parser',
          'babylon',
          options.dry && '--dry',
          options.dry && '--print',
        ].filter(Boolean);

        for (const transform of transforms) {
          spawn.sync(
            jscodeshift,
            ['--transform', transform, ...args, path.join(options.cwd, 'src')],
            {
              stdio: 'inherit',
            }
          );
        }

        // DropdownV2
        // DataTable
      },
    },
  ],
};
