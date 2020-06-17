const path = require('path');
const { exec } = require('child_process');
const { expect } = require('chai');
const createSymbolsProcess = path.resolve(__dirname, '..', '..', 'bin', 'create-symbols.js');

describe('create-symbols.js', function (done) {
  after(function () {
    exec('rm -rf test/bin/output');
  });

  it('should execute process', function (done) {
    exec(`${createSymbolsProcess} -i test/bin/fixtures -o test/bin/output`, (err, stdout, stderr) => {
      console.log(err);
      console.log(stdout);
      console.log(stderr);
      done();
    });
   
  });
});