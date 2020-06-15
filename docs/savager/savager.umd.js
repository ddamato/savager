!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).Savager={})}(this,(function(e){"use strict";function t(e,t){const r=document.getElementById(e);if(!r)return;let n=document.getElementById(t);n||(n=document.createElementNS("http://www.w3.org/2000/svg","svg"),n.id=t,n.style.display="none",document.body.appendChild(n)),Array.prototype.slice.call(r.querySelectorAll("symbol")).forEach(e=>{!n.getElementById(e.id)&&n.appendChild(e)}),r.remove()}var r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var n=function(e,t,r){return e(r={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&r.path)}},r.exports),r.exports}((function(e){var t,n;t=r,n=function(){function e(e){var t=[];if(0===e.length)return"";if("string"!=typeof e[0])throw new TypeError("Url must be a string. Received "+e[0]);if(e[0].match(/^[^/:]+:\/*$/)&&e.length>1){var r=e.shift();e[0]=r+e[0]}e[0].match(/^file:\/\/\//)?e[0]=e[0].replace(/^([^/:]+):\/*/,"$1:///"):e[0]=e[0].replace(/^([^/:]+):\/*/,"$1://");for(var n=0;n<e.length;n++){var o=e[n];if("string"!=typeof o)throw new TypeError("Url must be a string. Received "+o);""!==o&&(n>0&&(o=o.replace(/^[\/]+/,"")),o=n<e.length-1?o.replace(/[\/]+$/,""):o.replace(/[\/]+$/,"/"),t.push(o))}var s=t.join("/"),i=(s=s.replace(/\/(\?|&|#[^!])/g,"$1")).split("?");return s=i.shift()+(i.length>0?"?":"")+i.join("&")}return function(){return e("object"==typeof arguments[0]?arguments[0]:[].slice.call(arguments))}},e.exports?e.exports=n():t.urljoin=n()}));class o{constructor(){this._registrar={}}get(e){return this._registrar[e]}replace(e){const{url:t,exposure:r,id:n}=this._parseNode(e);if(this.get(n))return Promise.resolve(this._replace(e,n));if("internal"===r){const t=e.getRootNode();if(t.getElementById(n))return Promise.resolve("Reference found in root, replacement halted.");if(e.getRootNode({composed:!0})!==t)return this._embedInternal(e,{id:n})}return"external"===r?this._embedExternal(e,{id:n,url:t}):Promise.reject("Could not find asset reference. Ensure the reference sheet or external url exist before executing this script")}_replace(e,t){const r=this.get(t);if(r){const t=r.cloneNode(!0);t.removeAttribute("id"),t.setAttribute("replaced","");const n=e.parentNode;return n.hasAttributes()&&[...n.attributes].forEach(({name:e,value:r})=>t.setAttribute(e,r)),n.replaceWith(t),t}}register(e,t,r){return this._registrar[t]=r,this._replace(e,t)}_embedInternal(e,{id:t}){const r=document.getElementById(t);if(r){const n=r.cloneNode(!0);return Promise.resolve(this.register(e,t,this._transformSymbol(n)))}return Promise.reject(`Symbol "${t}" not found in document.`)}_embedExternal(e,{id:t,url:r}){return fetch(r).then(e=>e.text()).then(r=>{const n=(new DOMParser).parseFromString(r,"image/svg+xml").querySelector("symbol");if(n)return this.register(e,t,this._transformSymbol(n));throw new Error("Malformed external reference, please ensure '<symbol/>' assets.")}).catch(e=>console.error(e))}_parseNode(e){const t=e.getAttribute("href"),[r,n]=t.split("#");let o=e.getAttribute("exposure");return o||(o=Boolean(r)?"external":"internal"),{url:t,exposure:o,id:n}}_transformSymbol(e){const t=document.createElementNS("http://www.w3.org/2000/svg","svg");return e.children&&[...e.children].forEach(e=>t.appendChild(e)),e.hasAttributes()&&[...e.attributes].forEach(({name:e,value:r})=>t.setAttribute(e,r)),t}}const s="window.svgInjectionManager && window.svgInjectionManager.replace(this)",i={style:"animation: nodeDetected .1ms",onanimationstart:s,onerror:s},a=()=>{if("undefined"!=typeof window)return window.svgInjectionManager=new o,window.svgInjectionManager};class c{constructor(e,t){this._symbols={},this._options=Object.assign({},t),this.storeSymbols(e)}prepareAssets(e,r){const{externalPath:o,attemptInject:s,classNames:c,toSvgElement:u,consolidate:p,autoAppend:f}=Object.assign(r||{},this._options),m={xmlns:"http://www.w3.org/2000/svg"},g={prepareConsolidation:void 0===p||Boolean(p)};g.prepareConsolidation&&(g.primarySheetId="string"==typeof p?p.toString():"savager-primarysheet");const h={};s&&(h.inject=a),c&&(m.class=[].concat(c).filter(Boolean).join(" "));let y=e=>e;u&&(y="function"==typeof u?u:d);const b=[].concat(e).reduce((function(e,t){const r=Object.assign({exposure:"internal"},m);let a={href:"#"+t};if(o){r.exposure="external";const e="string"==typeof o?o:"";a.href=n(e,t+".svg",a.href)}let c="";s&&(c="<style>@keyframes nodeDetected { to { opacity: 1; } }</style>",a=Object.assign(a,i));const u=`<svg ${l(r)}>${c}<use ${l(a)}/></svg>`;return Object.assign(e,{[t]:u})}),{}),w=this._symbols;let v=Object.keys(b).reduce((function(e,t){return w&&w[t]?e+w[t].replace(/<\/?svg ?[^>]*>/gim,""):e}),"");if(h.assets=Object.entries(b).reduce((function(e,[t,r]){return Object.assign(e,{[t]:y(r)})}),{}),v&&!o){const{sheet:e}=function(e,r){const{prepareConsolidation:n,primarySheetId:o}=r,s="savager-"+Math.random().toString(36).substr(2,9),i=`id="${s}" xmlns="http://www.w3.org/2000/svg" style="display:none;"`;let a="";if(n){const e=`(${t.toString()})('${s}', '${o}')`.replace(/\"/g,"'");a=`<image href="#" onerror="${e}"/>`}return{sheet:`<svg ${i}>${a}${e}</svg>`}}(v,g);h.sheet=y(e),f&&function(e){if("undefined"==typeof document||!document.createElement)throw new Error("Attempted to autoAppend without browser context");document.body.appendChild(d(e))}(e)}return h}storeSymbols(e){return this._symbols=Object.assign({},this._symbols,e),this}}function l(e){return Object.entries(e).map(([e,t])=>`${e}="${t}"`).join(" ")}let u;function d(e){if("undefined"!=typeof document&&document.createElement){u||(u=document.createElement("div")),u.innerHTML=e;const t=document.createDocumentFragment();return[...u.children].forEach(e=>t.appendChild(e)),t}return e}function p(e,t){let r='xmlns="http://www.w3.org/2000/svg"';const n=e.replace(/(xmlns=.[^"']+)./gim,e=>(r=e,"")).replace(/(<\/?)svg/gim,"$1symbol").replace(/<symbol/,`<symbol id="${t}"`);return`<svg ${r}>${n}</svg>`.replace(/\r?\n|\r|/g,"").replace(/ {2,}/g," ")}const f=c;e.Savager=f,e.createSymbols=async function e(t){if(!t)return{};if("string"==typeof t){if("undefined"!=typeof window||!require)throw new Error("Can only create symbols using path within node environment.");const r=require("path"),n=require("fs");try{const o=await n.promises.readdir(t),s=await Promise.all(o.map(async e=>({[r.parse(e).name]:(await n.promises.readFile(r.resolve(t,e))).toString()})));return e(s.reduce((e,t)=>Object.assign(e,t),{}))}catch(e){throw new Error(e)}}return"object"==typeof t?Object.entries(t).reduce((e,[t,r])=>Object.assign(e,{[t]:p(r,t)}),{}):void 0},e.default=c,e.injectionFn=a,Object.defineProperty(e,"__esModule",{value:!0})}));
