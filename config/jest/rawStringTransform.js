'use strict';

// Mock for `?raw` imports in Jest — returns an empty string.
// In a real browser the Vite `?raw` suffix returns the file content as a string.
// For tests, the shader source is not executed, so a stub suffices.
module.exports = '';
