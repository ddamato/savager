import jsdomGlobal from 'jsdom-global';
import { expect } from 'chai';

import consolidateSheet from '../../src/consolidateSheet.js';

jsdomGlobal()();

describe('consolidateSheet', function () {
  it('should be a function', function () {
    expect(consolidateSheet).to.be.a('function');
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

    it('should do nothing if no sheets are found', function() {
      consolidateSheet();
      expect(document.body.innerHTML).to.equal('');
    });

    it('should create a master sheet', function () {
      const id = 'savager-referencesheet';
      document.body.innerHTML = `<svg id="${id}"></svg>`;
      consolidateSheet(id);
      expect(document.body.innerHTML).to.equal('<svg id="savager-primarysheet" style="display: none;"></svg>');
    });

    it('should consolidate symbols', function () {
      const duplicate = `<symbol id="highlander"></symbol>`;
      const id = 'savager-referencesheet';
      document.body.innerHTML = `<svg id="${id}">${duplicate}</svg><svg id="savager-primarysheet" style="display: none;">${duplicate}</svg>`;
      consolidateSheet(id);
      expect(document.body.innerHTML).to.equal(`<svg id="savager-primarysheet" style="display: none;">${duplicate}</svg>`);
    });

    it('should set a given primary sheet id', function () {
      const id = 'savager-referencesheet';
      document.body.innerHTML = `<svg id="${id}"></svg>`;
      consolidateSheet(id, 'primary');
      expect(document.body.innerHTML).to.equal('<svg id="primary" style="display: none;"></svg>');
    });

    it('should keep existing symbols that are unique by id', function () {
      const incoming = `<symbol id="highlander"></symbol><symbol id="snowflake"></symbol>`;
      const existing = `<symbol id="highlander"></symbol><symbol id="staple"></symbol>`
      const id = 'savager-referencesheet';
      document.body.innerHTML = `<svg id="${id}">${incoming}</svg><svg id="savager-primarysheet" style="display: none;">${existing}</svg>`;
      consolidateSheet(id);
      expect(document.body.innerHTML).to.equal('<svg id="savager-primarysheet" style="display: none;"><symbol id="highlander"></symbol><symbol id="staple"></symbol><symbol id="snowflake"></symbol></svg>');
    });
  });
});