import { expect } from 'chai';

import { injectionStyle, injectionAttrs, injectionFn } from '../src/injectionManager.js';

describe('injectionManager', function () {
  it('should be a function', function () {
    expect(injectionFn).to.be.a('function');
  });
});