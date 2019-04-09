/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

function findCarbonReactImport(j, root, importName) {
  const result = root.find(j.ImportDeclaration, {
    specifiers: [
      {
        imported: {
          name: importName,
        },
      },
    ],
    source: {
      value: 'carbon-components-react',
    },
  });

  if (result.size()) {
    return result.find(j.ImportSpecifier);
  }

  return null;
}

function replaceReactComponent(j, root, componentName, newComponentName) {
  const componentImport = findCarbonReactImport(j, root, componentName);
  if (!componentImport) {
    return null;
  }

  componentImport.find(j.Identifier).forEach(path => {
    if (path.name === 'imported') {
      path.value.name = newComponentName;
    }
  });

  root
    .findJSXElements(componentName)
    .find(j.JSXIdentifier)
    .forEach(path => {
      if (
        path.parentPath.name === 'openingElement' ||
        path.parentPath.name === 'closingElement'
      ) {
        path.value.name = newComponentName;
      }
    });

  return root;
}

module.exports = {
  findCarbonReactImport,
  replaceReactComponent,
};
