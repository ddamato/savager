import { expect } from 'chai';

import Savager from '../src/savager.js';

describe('Savager (browser context)', function () {

  beforeEach(function () {
    this.jsdom = require('jsdom-global')();
  });

  afterEach(function () {
    this.jsdom()
  });

  it('should attempt to automatically append a reference sheet', function() {
    const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
    const savager = new Savager({ balloon: symbol }, { autoAppend: true });
    const { assets } = savager.prepareAssets('balloon');
    expect(assets.balloon).to.exist;
    expect(document.body.innerHTML).to.include('style="display:none;"');
  });

  it('should use default render function when requested', function() {
    const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
    const savager = new Savager({ balloon: symbol }, { toSvgElement: true });
    const { assets } = savager.prepareAssets('balloon');
    expect(assets.balloon).to.exist;
    expect(assets.balloon.children).to.exist;
  });
});