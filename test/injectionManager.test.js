import jsdomGlobal from 'jsdom-global';
import { expect } from 'chai';

import { injectionStyle, injectionAttrs, injectionFn } from '../src/injectionManager.js';

describe('injectionManager', function () {
  it('should export style', function () {
    expect(injectionStyle).to.equal('<style>@keyframes nodeDetected { to { opacity: 1; } }</style>');
  });

  it('should export attributes', function () {
    expect(injectionAttrs.style).to.be.a('string');
    expect(injectionAttrs.onanimationstart).to.be.a('string');
    expect(injectionAttrs.onerror).to.be.a('string');
  });

  it('should be a function', function () {
    expect(injectionFn).to.be.a('function');
  });

  describe('browser context', function () {
    let jsdom
    before(function() {
      jsdom = jsdomGlobal();
    });

    beforeEach(function() {
      document.body.innerHTML = '';
    });

    after(function() {
      jsdom();
    });

    it('should create new instance on the window', function () {
      injectionFn();
      expect(window['svgInjectionManager']).to.exist;
    });
  })
});