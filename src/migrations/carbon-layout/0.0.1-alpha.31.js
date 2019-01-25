/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { reporter } = require('../../reporter');
const { replace } = require('../../tools/replace');

function createFunctionRegex(name) {
  const parts = [
    // Make sure there is a space before the group, useful for things that might
    // intersect
    '(?<= )',
    // Positive lookahead for the function definition
    `(?=${name}\\(.*\\))`,
    // Negative lookahead for checking if already migrated
    '(?<!carbon--)',
    // Capture the name of the function itself to change
    `(${name})`,
  ];
  return new RegExp(parts.join(''), 'gm');
}

function createVariableRegex(name) {
  return new RegExp(`\\$${name}`, 'gm');
}

const TARGET_VERSION = '0.0.1-alpha.31';
const changes = [
  // Breakpoints
  {
    filename: '_breakpoint.scss',
    from: createVariableRegex('grid-cell-padding'),
    to: '$carbon--grid-cell-padding',
  },
  {
    filename: '_breakpoint.scss',
    from: createVariableRegex('grid-gutter'),
    to: '$carbon--grid-gutter',
  },
  {
    filename: '_breakpoint.scss',
    from: createVariableRegex('grid-breakpoints'),
    to: '$carbon--grid-breakpoints',
  },
  {
    filename: '_breakpoint.scss',
    from: createFunctionRegex('breakpoint-next'),
    to: 'carbon--breakpoint-next',
  },
  {
    filename: '_breakpoint.scss',
    from: createFunctionRegex('breakpoint-prev'),
    to: 'carbon--breakpoint-prev',
  },
  {
    filename: '_breakpoint.scss',
    from: createFunctionRegex('is-smallest-breakpoint'),
    to: 'carbon--is-smallest-breakpoint',
  },
  {
    filename: '_breakpoint.scss',
    from: createFunctionRegex('largest-breakpoint-name'),
    to: 'carbon--largest-breakpoint-name',
  },
  {
    filename: '_breakpoint.scss',
    from: createFunctionRegex('breakpoint-infix'),
    to: 'carbon--breakpoint-infix',
  },
  {
    filename: '_breakpoint.scss',
    from: createFunctionRegex('breakpoint-up'),
    to: 'carbon--breakpoint-up',
  },
  {
    filename: '_breakpoint.scss',
    from: createFunctionRegex('breakpoint-down'),
    to: 'carbon--breakpoint-down',
  },
  {
    filename: '_breakpoint.scss',
    from: createFunctionRegex('breakpoint-between'),
    to: 'carbon--breakpoint-between',
  },
  {
    filename: '_breakpoint.scss',
    from: createFunctionRegex('breakpoint'),
    to: 'carbon--breakpoint',
  },

  // Conversion
  {
    filename: '_convert.scss',
    // from: /\$base-font-size/gm,
    from: createVariableRegex('base-font-size'),
    to: '$carbon--base-font-size',
  },
  {
    filename: '_convert.scss',
    from: createFunctionRegex('rem'),
    to: 'carbon--rem',
  },
  {
    filename: '_convert.scss',
    from: createFunctionRegex('em'),
    to: 'carbon--em',
  },

  // Key heights
  {
    filename: '_key-height.scss',
    from: createFunctionRegex('get-column-width'),
    to: 'carbon--get-column-width',
  },
  {
    filename: '_key-height.scss',
    from: createVariableRegex('key-height-scales'),
    to: '$carbon--key-height-scales',
  },
  {
    filename: '_key-height.scss',
    from: createFunctionRegex('key-height'),
    to: 'carbon--key-height',
  },

  // Mini-units
  {
    filename: '_mini-unit.scss',
    from: createVariableRegex('mini-unit-size'),
    to: '$carbon--mini-unit-size',
  },
  {
    filename: '_mini-unit.scss',
    from: createFunctionRegex('mini-units'),
    to: 'carbon--mini-units',
  },

  // Spacing
  {
    filename: '_spacing.scss',
    from: createVariableRegex('fixed-spacing-scale'),
    to: '$carbon--fixed-spacing-scale',
  },
  {
    filename: '_spacing.scss',
    from: createVariableRegex('fluid-spacing-scale'),
    to: '$carbon--fluid-spacing-scale',
  },
  {
    filename: '_mini-unit.scss',
    from: createFunctionRegex('spacing'),
    to: 'carbon--spacing',
  },

  // Utilities
  {
    filename: '_utilities.scss',
    from: createFunctionRegex('key-by-index'),
    to: 'carbon--key-by-index',
  },
];

module.exports = {
  version: TARGET_VERSION,
  from: [
    {
      version: '0.0.1-alpha.30',
      async migrate(options) {
        reporter.info(
          'Running migration for @carbon/layout from 0.0.1-alpha.30 to ' +
            '0.0.0-alpha.31'
        );

        await replace('**/*.scss', changes, options);
      },
    },
  ],
};
