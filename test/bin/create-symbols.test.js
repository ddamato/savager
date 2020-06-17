const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { promisify } = require('util');
const esmImport = require('esm')(module);
const { expect } = require('chai');
const createSymbolsProcess = path.resolve(__dirname, '..', '..', 'bin', 'create-symbols.js');
const outputPath = path.resolve(__dirname, 'output');

const execPromise = promisify(exec);

describe('create-symbols.js', async function () {
  afterEach(async function () {
    await execPromise('rm -rf test/bin/output');
  });

  it('should execute process', async function () {
    await execPromise(`${createSymbolsProcess} -i test/bin/fixtures -o test/bin/output`);
    const exists = await fs.pathExists(outputPath);
    expect(exists).to.be.true;
  });

  it('should create json file by default', async function () {
    await execPromise(`${createSymbolsProcess} -i test/bin/fixtures -o test/bin/output`);
    const jsonPath = path.join(outputPath, 'manifest.json');
    const exists = await fs.pathExists(jsonPath);
    const data = await fs.readJson(jsonPath);
    expect(exists).to.be.true;
    expect(data.x).to.be.a('string');
  });

  it('should create json file when requested', async function () {
    await execPromise(`${createSymbolsProcess} -i test/bin/fixtures -o test/bin/output -t json`);
    const jsonPath = path.join(outputPath, 'manifest.json');
    const exists = await fs.pathExists(jsonPath);
    const data = await fs.readJson(jsonPath);
    expect(exists).to.be.true;
    expect(data.x).to.be.a('string');
  });

  it('should create a cjs file when requested', async function () {
    await execPromise(`${createSymbolsProcess} -i test/bin/fixtures -o test/bin/output -t cjs`);
    const cjsPath = path.join(outputPath, 'manifest.js');
    const exists = await fs.pathExists(cjsPath);
    const { x } = require(cjsPath);
    expect(exists).to.be.true;
    expect(x).to.be.a('string');
  });

  it('should create an esm file when requested', async function () {
    await execPromise(`${createSymbolsProcess} -i test/bin/fixtures -o test/bin/output -t esm`);
    const esmPath = path.join(outputPath, 'manifest.js');
    const exists = await fs.pathExists(esmPath);
    const { x } = esmImport(esmPath);
    expect(exists).to.be.true;
    expect(x).to.be.a('string');
  })
});