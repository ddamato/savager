import path from 'path';
import jsdomGlobal from 'jsdom-global';
import { expect } from 'chai';

import createSymbols from '../../src/createSymbols.js';

jsdomGlobal()();

describe('createSymbols', function () {
  it('should be a function', function () {
    expect(createSymbols).to.be.a('function');
  });

  it('should create symbols from path', async function () {
    const symbols = await createSymbols(path.resolve(__dirname, 'fixtures'));
    expect(symbols.x).to.be.a('string');
  });

  it('should throw if it cannot read given directory', async function () {
    try {
      await createSymbols(path.resolve(__dirname, 'undefined'));
    } catch (err) {
      expect(err).to.exist;
    }
  });

  it('should throw if no symbols are in directory', async function () {
    try {
      await createSymbols(path.resolve(__dirname, 'fixtures', 'none'));
    } catch (err) {
      expect(err).to.exist;
    }
  });

  it('should process a given object as svg strings', async function () {
    const x = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path/></svg>';
    const symbols = await createSymbols({ x })
    expect(symbols.x).to.be.a('string');
  });

  it('should include complex collection of shapes', async function () {
    const x = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path/><polygon/><circle/></svg>';
    const symbols = await createSymbols({ x });
    expect(symbols.x).to.include('<path/><polygon/><circle/>');
  });

  it('should throw if incorrect parameter is provided', async function () {
    try {
      await createSymbols(42);
    } catch (err) {
      expect(err).to.exist;
    }
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

    it('should throw if reading path in browser context', async function() {
      try {
        await createSymbols(path.resolve(__dirname, 'fixtures'));
      } catch (err) {
        expect(err).to.exist;
      }
    });
  });
});