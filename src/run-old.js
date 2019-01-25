/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs-extra');
const inquirer = require('inquirer');
const { findPackageJson } = require('./project');
const { reporter } = require('./reporter');
const safeAsync = require('./tools/safeAsync');
const supportedPackageMigrations = require('./migrations');

async function run({ cwd, dry }) {
  const [result, findPackageJsonError] = await safeAsync(findPackageJson(cwd));
  if (findPackageJsonError) {
    throw new Error(`Unable to find package.json file in: ${cwd}`);
  }

  const [packageJsonPath] = result;
  const packageJson = await fs.readJson(packageJsonPath);
  const { dependencies = {}, devDependencies = {} } = packageJson;
  const packageDependencies = [
    ...Object.keys(dependencies).map(name => ({
      name,
      version: dependencies[name],
      type: 'dependency',
    })),
    ...Object.keys(devDependencies).map(name => ({
      name,
      version: devDependencies[name],
      type: 'devDependency',
    })),
  ];

  // TODO: make sure we don't double run a migration for a dependency

  const dependenciesToMigrate = packageDependencies
    .map(dependency => {
      if (supportedPackageMigrations.has(dependency.name)) {
        const packageMigrations = supportedPackageMigrations.get(
          dependency.name
        );

        for (const migration of packageMigrations) {
          for (const { migrate, version } of migration.from) {
            if (version === dependency.version) {
              return [dependency, migrate, migration.version];
            }
          }
        }
      }
      return false;
    })
    .filter(Boolean);

  if (dependenciesToMigrate.length === 0) {
    reporter.info(`No migrations found for dependencies in ${packageJsonPath}`);
  } else {
    const answers = await inquirer.prompt({
      type: 'checkbox',
      name: 'dependencies',
      message: 'Select the migrations you would like us to run:',
      choices: dependenciesToMigrate.map(([dependency, _, version]) => {
        return {
          name: createChoiceFrom(dependency, version),
          short: dependency.name,
          checked: true,
        };
      }),
    });

    if (answers.dependencies.length > 0) {
      await Promise.all(
        dependenciesToMigrate
          .filter(([dependency, _, version]) => {
            return answers.dependencies.includes(
              createChoiceFrom(dependency, version)
            );
          })
          .map(([dependency, migrate]) => {
            // TODO update package.json, making sure to respect dry option
            return migrate(dependency, cwd, dry);
          })
      );
    }
  }

  reporter.success('Done! ✨');
}

function createChoiceFrom(dependency, version) {
  return `${dependency.name} from ${dependency.version} to ${version}`;
}

module.exports = run;
