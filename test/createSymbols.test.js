import { expect } from 'chai';

import createSymbols from '../src/createSymbols.js';

describe('createSymbols', function () {
  it('should be a function', function () {
    expect(createSymbols).to.be.a('function');
  });
});