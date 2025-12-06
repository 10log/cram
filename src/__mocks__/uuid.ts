// Mock uuid module for testing
let counter = 0;

export const v4 = jest.fn(() => {
  counter++;
  return `test-uuid-${counter}`;
});

export const v1 = jest.fn(() => {
  counter++;
  return `test-uuid-v1-${counter}`;
});

export default {
  v4,
  v1,
};
