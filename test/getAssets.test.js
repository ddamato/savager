import { expect } from 'chai';

import getAssets from '../src/getAssets.js';

describe('getAssets', function () {
  it('should be a function', function () {
    expect(getAssets).to.be.a('function');
  });

  it('should return assets with no options', function () {
    const { assets } = getAssets('balloon');
    expect(assets.balloon).to.be.a('string');
  });
});