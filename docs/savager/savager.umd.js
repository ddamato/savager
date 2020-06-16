!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).Savager={})}(this,(function(e){"use strict";var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var r=function(e,t,r){return e(r={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&r.path)}},r.exports),r.exports}((function(e){var r,n;r=t,n=function(){function e(e){var t=[];if(0===e.length)return"";if("string"!=typeof e[0])throw new TypeError("Url must be a string. Received "+e[0]);if(e[0].match(/^[^/:]+:\/*$/)&&e.length>1){var r=e.shift();e[0]=r+e[0]}e[0].match(/^file:\/\/\//)?e[0]=e[0].replace(/^([^/:]+):\/*/,"$1:///"):e[0]=e[0].replace(/^([^/:]+):\/*/,"$1://");for(var n=0;n<e.length;n++){var o=e[n];if("string"!=typeof o)throw new TypeError("Url must be a string. Received "+o);""!==o&&(n>0&&(o=o.replace(/^[\/]+/,"")),o=n<e.length-1?o.replace(/[\/]+$/,""):o.replace(/[\/]+$/,"/"),t.push(o))}var s=t.join("/"),i=(s=s.replace(/\/(\?|&|#[^!])/g,"$1")).split("?");return s=i.shift()+(i.length>0?"?":"")+i.join("&")}return function(){return e("object"==typeof arguments[0]?arguments[0]:[].slice.call(arguments))}},e.exports?e.exports=n():r.urljoin=n()}));let n;function o(e){if("undefined"!=typeof document&&document.createElement){n||(n=document.createElement("div")),n.innerHTML=e;const t=document.createDocumentFragment();return[...n.children].forEach(e=>t.appendChild(e)),t}return e}class s{constructor(){this._registrar={}}get(e){return this._registrar[e]}replace(e){const{url:t,exposure:r,id:n}=this._parseNode(e);if(this.get(n))return Promise.resolve(this._replace(e,n));if("internal"===r){return e.getRootNode().getElementById(n)?Promise.resolve("Reference found in root, replacement halted."):this._embedInternal(e,{id:n})}return"external"===r?this._embedExternal(e,{id:n,url:t}):Promise.reject("Could not find asset reference. Ensure the reference sheet or external url exist before executing this script")}_replace(e,t){const r=this.get(t).cloneNode(!0);r.removeAttribute("id"),r.setAttribute("replaced","");const n=e.parentNode;return[...n.attributes].forEach(({name:e,value:t})=>r.setAttribute(e,t)),n.replaceWith(r),r}register(e,t,r){return this._registrar[t]=r,this._replace(e,t)}_embedInternal(e,{id:t}){const r=document.getElementById(t);if(r){const n=r.cloneNode(!0);return Promise.resolve(this.register(e,t,this._transformSymbol(n)))}return Promise.reject(`Symbol "${t}" not found in document.`)}_embedExternal(e,{id:t,url:r}){return window.fetch(r).then(e=>e.text()).then(r=>{const n=(new DOMParser).parseFromString(r,"image/svg+xml").querySelector("symbol");if(n)return this.register(e,t,this._transformSymbol(n));throw new Error("Malformed external reference, please ensure '<symbol/>' assets.")}).catch(e=>console.error(e))}_parseNode(e){const t=e.getAttribute("href");if(!t)return{};const[r,n]=t.split("#");let o=e.getAttribute("exposure");return o||(o=Boolean(r)?"external":"internal"),{url:t,exposure:o,id:n}}_transformSymbol(e){const t=document.createElementNS("http://www.w3.org/2000/svg","svg");return e.children&&[...e.children].forEach(e=>t.appendChild(e)),e.hasAttributes()&&[...e.attributes].forEach(({name:e,value:r})=>t.setAttribute(e,r)),t}}const i="window.svgInjectionManager && window.svgInjectionManager.replace(this)",a={style:"animation: nodeDetected .1ms",onanimationstart:i,onerror:i},c=()=>{if("undefined"!=typeof window)return window.svgInjectionManager=new s,window.svgInjectionManager};function l(e,t){const{externalPath:n,attemptInject:s,classNames:i,toSvgElement:l}=t||{},d={xmlns:"http://www.w3.org/2000/svg"},p={};s&&(p.inject=c),i&&(d.class=[].concat(i).filter(Boolean).join(" "));let f=e=>e;l&&(f="function"==typeof l?l:o);const m=[].concat(e).reduce((function(e,t){const o=Object.assign({exposure:"internal"},d);let i={href:"#"+t};"string"==typeof n&&(o.exposure="external",i.href=r(n,t+".svg",i.href));let c="";s&&(c="<style>@keyframes nodeDetected { to { opacity: 1; } }</style>",i=Object.assign(i,a));const l=`<svg ${u(o)}>${c}<use ${u(i)}/></svg>`;return Object.assign(e,{[t]:l})}),{});return p.assets=Object.entries(m).reduce((function(e,[t,r]){return Object.assign(e,{[t]:f(r)})}),{}),p}function u(e){return Object.entries(e).map(([e,t])=>`${e}="${t}"`).join(" ")}function d(e,t){const r=document.getElementById(e);if(!r)return;t||(t="savager-primarysheet");let n=document.getElementById(t);n||(n=document.createElementNS("http://www.w3.org/2000/svg","svg"),n.id=t,n.style.display="none",document.body.appendChild(n)),Array.prototype.slice.call(r.querySelectorAll("symbol")).forEach(e=>{!n.getElementById(e.id)&&n.appendChild(e)}),r.remove()}class p{constructor(e,t){this._symbols={},this._options=Object.assign({},t),this.storeSymbols(e)}prepareAssets(e,t){const{consolidate:r,autoAppend:n,...s}=Object.assign(t||{},this._options);let i=e=>e;s.toSvgElement&&(i="function"==typeof s.toSvgElement?s.toSvgElement:o);const a=l(e,s),c={prepareConsolidation:void 0===r||Boolean(r)};c.prepareConsolidation&&(c.primarySheetId="string"==typeof r?r.toString():"savager-primarysheet");const u=this._symbols;let p=Object.keys(a.assets).reduce((function(e,t){return u&&u[t]?e+u[t].replace(/<\/?svg ?[^>]*>/gim,""):e}),"");if(p&&!s.externalPath){const{sheet:e}=function(e,t){const{prepareConsolidation:r,primarySheetId:n}=t,o="savager-"+Math.random().toString(36).substr(2,9),s=`id="${o}" xmlns="http://www.w3.org/2000/svg" style="display:none;"`;let i="";if(r){const e=`(${d.toString()})('${o}', '${n}')`.replace(/\"/g,"'");i=`<image href="#" onerror="${e}"/>`}return{sheet:`<svg ${s}>${i}${e}</svg>`}}(p,c);a.sheet=i(e),n&&function(e){if("undefined"==typeof document||!document.createElement)throw new Error("Attempted to autoAppend without browser context");document.body.appendChild(o(e))}(e)}return a}storeSymbols(e){return this._symbols=Object.assign({},this._symbols,e),this}}function f(e,t){let r='xmlns="http://www.w3.org/2000/svg"';const n=e.replace(/(xmlns=.[^"']+)./gim,e=>(r=e,"")).replace(/(<\/?)svg/gim,"$1symbol").replace(/<symbol/,`<symbol id="${t}"`);return`<svg ${r}>${n}</svg>`.replace(/\r?\n|\r|/g,"").replace(/ {2,}/g," ")}const m=p;e.Savager=m,e.createSymbols=async function e(t){if("string"!=typeof t){if("object"==typeof t)return Object.entries(t).reduce((e,[t,r])=>Object.assign(e,{[t]:f(r,t)}),{});throw new Error("Unknown argument provided. Must be an object or path to files.",t)}{if("undefined"!=typeof window||!require)throw new Error("Can only create symbols using path within node environment.");const r=require("path"),n=require("fs");try{const o=await n.promises.readdir(t),s=await Promise.all(o.map(async e=>({[r.parse(e).name]:(await n.promises.readFile(r.resolve(t,e))).toString()})));return e(s.reduce((e,t)=>Object.assign(e,t),{}))}catch(e){throw new Error(e)}}},e.default=p,e.getAssets=l,e.injectionFn=c,Object.defineProperty(e,"__esModule",{value:!0})}));
