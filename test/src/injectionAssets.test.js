import jsdomGlobal from 'jsdom-global';
import { expect } from 'chai';

import { injectionStyle, injectionAttrs } from '../../src/injectionAssets.js';
import injectionInit from '../../src/injectionManager.js';

jsdomGlobal()();

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
    expect(injectionInit).to.be.a('function');
  });

  it('should not create instance without a window', function() {
    injectionInit();
    expect(global.window).to.not.exist;
  });

  describe('browser context', function () {
    let jsdom
    before(function() {
      jsdom = jsdomGlobal();
      global.DOMParser = window.DOMParser;
    });

    beforeEach(function() {
      document.body.innerHTML = '';
      window['svgInjectionManager'] = null;
      injectionInit();
      window.fetch = null;
    });

    after(function() {
      jsdom();
    });

    it('should create new instance on the window', function () {
      expect(window['svgInjectionManager']).to.exist;
    });

    it('should inject if SVG is within ShadowDOM', function (done) {
      document.body.innerHTML = '<svg><symbol id="balloon"><path></path></symbol></svg>';
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      div.shadowRoot.innerHTML = '<svg><use href="#balloon"></use></svg>';
      const useNode = div.shadowRoot.querySelector('use');
      document.body.appendChild(div);
      
      window['svgInjectionManager'].replace(useNode).then(() => {
        expect(window['svgInjectionManager'].get('balloon')).to.exist;
        done();
      }).catch(done);
    });

    it('should not error if there are no child nodes', function (done) {
      document.body.innerHTML = '<svg><symbol id="balloon"></symbol></svg>';
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      div.shadowRoot.innerHTML = '<svg><use href="#balloon"></use></svg>';
      const useNode = div.shadowRoot.querySelector('use');
      document.body.appendChild(div);
      
      window['svgInjectionManager'].replace(useNode).then(() => {
        expect(window['svgInjectionManager'].get('balloon')).to.exist;
        done();
      }).catch(done);
    });

    it('should include attributes from reference sheet in host', function (done) {
      const attrs = 'viewBox="0 0 24 24" role="img"';
      document.body.innerHTML = `<svg><symbol id="balloon" ${attrs}><path></path></symbol></svg>`;
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      div.shadowRoot.innerHTML = '<svg><use href="#balloon"></use></svg>';
      const useNode = div.shadowRoot.querySelector('use');
      document.body.appendChild(div);
      
      window['svgInjectionManager'].replace(useNode).then(() => {
        expect(document.body.innerHTML).to.include(attrs);
        expect(document.querySelector('symbol').outerHTML).to.include(attrs);
        expect(window['svgInjectionManager'].get('balloon').outerHTML).to.include(attrs);
        expect(div.shadowRoot.innerHTML).to.include(attrs);
        done();
      }).catch(done);
    });

    it('should use internal reference if available', function (done) {
      document.body.innerHTML = '<svg><symbol id="balloon"><path></path></symbol></svg>';

      const createElem = () => {
        const assetHTML = '<svg><use href="#balloon"></use></svg>';
        const div = document.createElement('div');
        div.attachShadow({ mode: 'open' });
        div.shadowRoot.innerHTML = assetHTML;
        const useNode = div.shadowRoot.querySelector('use');
        document.body.appendChild(div);
        return useNode;
      }

      const use1 = createElem();
      const use2 = createElem();

      Promise.all([
        window['svgInjectionManager'].replace(use1),
        window['svgInjectionManager'].replace(use2)
      ]).then(() => {
        expect(window['svgInjectionManager'].get('balloon')).to.exist
        done();
      }).catch(done);
    });

    it('should not replace if reference is found in root', function (done) {
      document.body.innerHTML = '<svg><symbol id="star"><path></path></symbol></svg>';
      const div = document.createElement('div');
      div.innerHTML = '<svg><use href="#star"></use></svg>';
      document.body.appendChild(div);

      const useNode = document.querySelector('use');
      window['svgInjectionManager'].replace(useNode).then(() => {
        expect(window['svgInjectionManager'].get('star')).to.not.exist;
        done();
      }).catch(done);
    });

    it('should error if reference not found in document', function(done) {
      document.body.innerHTML = '<svg><symbol id="soda"><path></path></symbol></svg>';
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      div.shadowRoot.innerHTML = '<svg><use href="#pop"></use></svg>';
      const useNode = div.shadowRoot.querySelector('use');
      document.body.appendChild(div);
      
      window['svgInjectionManager'].replace(useNode).catch((err) => {
        expect(err).to.exist;
        done();
      });
    });

    it('should attempt to fetch external asset', function (done) {
      const text = () => Promise.resolve('<symbol id="star"><path></path></symbol>');
      window.fetch = () => Promise.resolve({ text });
      const div = document.createElement('div');
      div.innerHTML = '<svg><use href="star.svg#star"></use></svg>';
      document.body.appendChild(div);

      const useNode = document.querySelector('use');
      window['svgInjectionManager'].replace(useNode).then(() => {
        expect(window['svgInjectionManager'].get('star')).to.exist;
        done();
      }).catch(done);
    });

    it('should read explicit exposure', function (done) {
      document.body.innerHTML = '<svg><symbol id="balloon"><path></path></symbol></svg>';
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      div.shadowRoot.innerHTML = '<svg><use href="balloon.svg#balloon" exposure="internal"></use></svg>';
      const useNode = div.shadowRoot.querySelector('use');
      document.body.appendChild(div);
      
      window['svgInjectionManager'].replace(useNode).then(() => {
        expect(window['svgInjectionManager'].get('balloon')).to.exist;
        done();
      }).catch(done);
    });

    it('should error if reference is not found', function (done) {
      document.body.innerHTML = '<svg><symbol id="birthday"><path></path></symbol></svg>';
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      div.shadowRoot.innerHTML = '<svg><use></use></svg>';
      const useNode = div.shadowRoot.querySelector('use');
      document.body.appendChild(div);
      
      window['svgInjectionManager'].replace(useNode).then(done).catch((err) => {
        expect(err).to.exist;
        done();
      });
    });

    it('should error if asset is malformed', function (done) {
      const text = () => Promise.resolve('<div></div>');
      window.fetch = () => Promise.resolve({ text });
      const div = document.createElement('div');
      div.innerHTML = '<svg><use href="yellow.svg#yellow"></use></svg>';
      document.body.appendChild(div);

      const useNode = document.querySelector('use');
      window['svgInjectionManager'].replace(useNode).then(done).catch((err) => {
        expect(err).to.exist;
        done();
      });
    });

    it('should error if external is unreachable', function (done) {
      window.fetch = () => Promise.reject();
      const div = document.createElement('div');
      div.innerHTML = '<svg><use href="blue.svg#blue"></use></svg>';
      document.body.appendChild(div);

      const useNode = document.querySelector('use');
      window['svgInjectionManager'].replace(useNode).then(done).catch((err) => {
        expect(err).to.exist;
        done();
      });
    })
  })
});