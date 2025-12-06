'use strict';

// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/en/webpack.html
// Updated for Jest 28+ which requires returning an object with `code` property

module.exports = {
  process() {
    return { code: 'module.exports = {};' };
  },
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform';
  },
};
