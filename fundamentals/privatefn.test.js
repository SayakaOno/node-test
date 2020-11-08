const mod = require('./privatefn');

const { __RewireAPI__ } = require('./privatefn');
__RewireAPI__.__Rewire__('B', jest.fn().mockReturnValue('C'));

describe('suite', () => {
  test('test', () => {
    const ret = mod.A();
    expect(ret).toEqual('CA');
  });
});
