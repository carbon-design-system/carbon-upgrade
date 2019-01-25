/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { UpgradeError } = require('./error');
const supportedMigrations = require('./migrations');

const packageNames = [...supportedMigrations.keys()].join(', ');

function run(packageName, range, options) {
  if (!supportedMigrations.has(packageName)) {
    throw new UpgradeError(
      `Unable to find a migration strategy for package: \`${packageName}\`, ` +
        `expected one of: [${packageNames}]`
    );
  }

  const migrations = supportedMigrations.get(packageName);
  const [from, to] = range;
  const targetVersion = find(migrations, ({ version }) => {
    return version === to;
  });
  if (!targetVersion) {
    throw new UpgradeError(
      `Unable to find a migration for version ${to} for package ${packageName}.`
    );
  }

  const migration = find(targetVersion.from, ({ version }) => {
    return version === from;
  });
  if (!migration) {
    throw new UpgradeError(
      `Unable to find a migration from version ${from} to version ${to} ` +
        `for package ${packageName}.`
    );
  }

  return migration.migrate(options);
}

function find(set, cb) {
  for (const item of set) {
    if (cb(item)) {
      return item;
    }
  }
}

module.exports = {
  run,
};
