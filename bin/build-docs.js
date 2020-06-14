const path = require('path');
const fs = require('fs-extra'); 
const nunjucks = require('nunjucks');
const { load } = require('cheerio');
const md = require('markdown-it')({
  html: true,
  linkify: true,
});
const mdPrism = require('markdown-it-prism');
const mdAnchor = require('markdown-it-anchor');
const { minify } = require('html-minifier');

md.use(mdPrism).use(mdAnchor);

const DOCS_DIR = path.resolve(__dirname, '..', 'docs');

const loader = new nunjucks.FileSystemLoader(DOCS_DIR);
const env = new nunjucks.Environment(loader, {
  trimBlocks: true,
  lstripBlocks: true,
});

async function buildDocs() {
  const index = path.join(DOCS_DIR, 'index.html');
  const markdown = await fs.readFile(path.join(DOCS_DIR, 'index.md'));
  const content = md.render(markdown.toString());
  const $ = load(content);
  const navigation = $('h2').map(function () { 
      return { text: $(this).text(), href: $(this).attr('id') }
   }).get();
  const html = env.render('index.njk', { content, navigation });
  fs.ensureFileSync(index);
  fs.writeFileSync(index, minify(html, { collapseWhitespace: true }), { encoding: 'utf8' });
}

buildDocs();