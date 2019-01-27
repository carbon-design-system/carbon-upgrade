/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { reporter } = require('../../reporter');
const colors = require('../carbon-colors/0.0.1-alpha.31');
const grid = require('../carbon-grid/0.0.1-alpha.31');
const layout = require('../carbon-layout/0.0.1-alpha.31');
const motion = require('../carbon-motion/0.0.1-alpha.31');

const TARGET_VERSION = '0.0.1-alpha.31';

module.exports = {
  version: TARGET_VERSION,
  from: [
    {
      version: '<=0.0.1-alpha.30',
      async migrate(options) {
        const migrations = [
          ...colors.from,
          ...grid.from,
          ...layout.from,
          ...motion.from,
        ].filter(({ version }) => version === '<=0.0.1-alpha.30');
        await Promise.all(
          migrations.map(migration => migration.migrate(options))
        );
      },
    },
  ],
};
