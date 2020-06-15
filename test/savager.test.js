import jsdomGlobal from 'jsdom-global';
import { expect } from 'chai';

import Savager from '../src/savager.js';

describe('Savager', function () {
 
  it('should be a function', function () {
    expect(Savager).to.be.a('function');
  });

  it('should return an instance', function () {
    const savager = new Savager();
    expect(savager).to.be.instanceOf(Savager);
  });

  it('should return stored assets', function () {
    const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
    const savager = new Savager({ balloon: symbol });
    const { assets } = savager.prepareAssets('balloon');
    expect(assets.balloon).to.exist;
    expect(assets.balloon).to.include('href="#balloon"');
  });

  it('should provide an inject script when requested', function () {
    const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
    const savager = new Savager({ balloon: symbol });
    const { assets, inject } = savager.prepareAssets('balloon', { attemptInject: true });
    expect(inject).to.be.a('function');
    expect(assets.balloon).to.include('@keyframes');
    expect(assets.balloon).to.include('onanimationstart');
    expect(assets.balloon).to.include('.replace(this)');
  });

  it('should add class names to asset', function () {
    const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
    const savager = new Savager({ balloon: symbol }, { classNames: ['svg-class'] });
    const { assets } = savager.prepareAssets('balloon');
    expect(assets.balloon).to.include('class="svg-class"');
  });

  it('should attempt to use toSvgElement function', function () {
    const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
    const toSvgElement = () => 42;
    const savager = new Savager({ balloon: symbol }, { toSvgElement });
    const { assets } = savager.prepareAssets('balloon');
    expect(assets.balloon).to.equal(42);
  });

  it('should use external url', function () {
    const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
    const savager = new Savager({ balloon: symbol }, { externalPath: 'path/to/assets' });
    const { assets } = savager.prepareAssets('balloon');
    expect(assets.balloon).to.include('href="path/to/assets/balloon.svg#balloon"');
  });

  it('should return string if using default toSvgElement and "document" is not defined', function() {
    const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
    const savager = new Savager({ balloon: symbol }, { toSvgElement: true });
    const { assets } = savager.prepareAssets('balloon');
    expect(assets.balloon).to.be.a('string');
  });

  it('should throw if autoAppend is requested without browser context', function() {
    const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
    const savager = new Savager({ balloon: symbol }, { autoAppend: true });
    const toThrow = () => { savager.prepareAssets('balloon') };
    expect(toThrow).to.throw();
  });

  describe('browser context', function() {
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

    it('should attempt to automatically append a reference sheet', function() {
      const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
      const savager = new Savager({ balloon: symbol }, { autoAppend: true });
      savager.prepareAssets('balloon');
      const svg = document.body.firstElementChild;
      expect(svg.tagName.toLowerCase()).equals('svg');
      expect(svg.id).to.include('savager-');
      expect(svg.style.display).to.equal('none');
    });
  
    it('should use default render function when requested', function() {
      const symbol = '<svg><symbol viewBox="0 0 24 24"><path/></symbol></svg>';
      const savager = new Savager({ balloon: symbol }, { toSvgElement: true });
      const { assets } = savager.prepareAssets('balloon');
      expect(assets.balloon).to.exist;
      expect(assets.balloon.children).to.exist;
    });
  });

  
});