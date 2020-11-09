const SomeClass = require('./SomeClass');

jest.mock('./SomeClass');
const mMock = jest.fn().mockImplementation(() => 'inside mock');
SomeClass.mockImplementation(() => {
  return {
    m: mMock
  };
});

const some = new SomeClass();
test('test', () => {
  expect(some.m('a', 'b')).toBe('inside mock');
});
