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

  it('should throw if it cannot read given directory', function (done) {
    createSymbols(path.resolve(__dirname, 'undefined')).then(done).catch((err) => {
      expect(err).to.exist;
      done();
    });
  });

  it('should process a given object as svg strings', function (done) {
    const x = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path/></svg>';
    createSymbols({ x }).then((symbols) => {
      expect(symbols.x).to.be.a('string');
      done();
    }).catch(done);
  });

  it('should throw if incorrect parameter is provided', function (done) {
    createSymbols(42).then(done).catch((err) => {
      expect(err).to.exist;
      done();
    })
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

    it('should throw if reading path in browser context', function(done) {
      createSymbols(path.resolve(__dirname, 'fixtures')).then(done).catch((err) => {
        expect(err).to.exist;
        done();
      }).catch(done);
    });
  });
});