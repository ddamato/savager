import { expect } from 'chai';

import getAssets from '../../src/getAssets.js';

describe('getAssets', function () {
  it('should be a function', function () {
    expect(getAssets).to.be.a('function');
  });

  it('should return assets with no options', function () {
    const { assets } = getAssets('balloon');
    expect(assets.balloon).to.be.a('string');
  });

  it('should allow for object as asset names', function () {
    const { assets } = getAssets([{ name: 'balloon' }]);
    expect(assets.balloon).to.be.a('string');
  });

  it('should allow add title and desc', function () {
    const balloonConfig = {
      name: 'balloon',
      title: 'My Balloon',
      desc: 'It is large, round, and light.'
    };
    const { assets } = getAssets(balloonConfig);
    expect(assets.balloon).to.include('<title>My Balloon</title>');
    expect(assets.balloon).to.include('<desc>It is large, round, and light.</desc>');
  });
});