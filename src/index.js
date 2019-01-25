/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const program = require('commander');
const packageJson = require('../package.json');
const { UpgradeError } = require('./error');
const { reporter } = require('./reporter');
const { run } = require('./run');

async function main({ argv, cwd }) {
  program
    .name(packageJson.name)
    .version(packageJson.version)
    .usage('[options]')
    .option(
      '-d, --dry',
      'view the result of running this command without changing any files',
      false
    )
    .option(
      '--verbose',
      'display the full output while running this command',
      false
    )
    .option(
      '-m, --migration <package-name> [range]',
      'run a specific package migration'
    )
    .option(
      '-i, --ignore <glob>',
      'provide a glob pattern for directories you would like ignored',
      []
    )
    .action(async (...args) => {
      const options = {
        cwd: cwd(),
      };

      if (args.length === 1) {
        options.dry = args[0].dry || false;
        options.verbose = args[0].verbose || false;
        options.ignore = args[0].ignore;
      } else if (args.length === 2) {
        options.dry = args[1].dry || false;
        options.verbose = args[1].verbose || false;
        options.ignore = args[1].ignore;
        options.migration = {
          packageName: args[1].migration,
          range: args[0].split('...'),
        };
      } else {
        throw new Error(
          `Expected either 1 or 2 arguments provided to commander, instead ` +
            `recieved: ${args.length}. Most likely there is an issue with ` +
            `the CLI command that was entered.`
        );
      }

      if (options.verbose) {
        reporter.setLogLevel('verbose');
      }

      reporter.info('Thanks for trying out carbon-upgrade! 🙏');
      reporter.info(
        'To help prevent any accidental changes, make sure to check in your ' +
          'work in version control first and try out dry mode (-d flag) to ' +
          'preview any changes!'
      );

      let promise;
      if (options.migration) {
        const { packageName, range } = options.migration;
        promise = run(packageName, range, options);
      }

      try {
        await promise;
        reporter.info('Done! ✨');
      } catch (error) {
        if (error instanceof UpgradeError) {
          reporter.error(error.message);
          return;
        }
        reporter.error('Yikes, looks like something really went wrong.');
        reporter.error('Please make an issue with the following info:');
        console.log(error);
      }
    })
    .parse(argv);
}

module.exports = main;
