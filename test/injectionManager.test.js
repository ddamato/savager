import { expect } from 'chai';

import { injectionStyle, injectionAttrs, injectionScript } from '../src/injectionManager.js';

describe('injectionManager', function () {
  it('should be a function', function () {
    expect(injectionScript).to.be.a('function');
  });
});